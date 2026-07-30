import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  ConfigurationTypes,
  LogContext,
  NOTIFICATIONS_PROVIDER,
} from '@common/enums';
import {
  BaseEventPayload,
  NotificationEventPayloadSpaceCollaborationCallout,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadOrganizationMessageRoom,
  NotificationEventPayloadOrganizationMessageDirect,
  NotificationEventPayloadSpaceCommunicationUpdate,
  NotificationEventPayloadUserMessageDirect,
  NotificationEventPayloadUserConversationMessageDirect,
  NotificationEventPayloadUserConversationMessageGroup,
  NotificationEventPayloadSpaceCommunityInvitation,
  NotificationEventPayloadPlatformForumDiscussion,
  NotificationEventPayloadPlatformGlobalRole,
  NotificationEventPayloadPlatformUserRegistration,
  NotificationEventPayloadPlatformUserRemoved,
  NotificationEventPayloadPlatformSpaceCreated,
  NotificationEventPayloadSpaceCommunityApplication,
  NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
  NotificationEventPayloadSpaceCommunityInvitationPlatform,
  NotificationEventPayloadSpaceCommunityContributor,
  NotificationEventPayloadUserMessageRoomReply,
  NotificationEventPayloadUserMessageRoom,
  NotificationEventPayloadSpaceCalendarEvent,
  NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
  NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
  NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
  NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
  NotificationEventPayloadUserEmailChangeSecuritySignal,
  NotificationEventPayloadUserEmailChangeNewAddress,
  NotificationEventPayloadUserEmailChangeGlobalAdmin,
  NotificationEventPayloadUserEmailChangeSpaceAdmin,
  NotificationEventPayloadUserPasswordChangeSecuritySignal,
} from '@alkemio/notifications-lib';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/notifme/notification.templates.builder';
import { User } from '@src/core/models';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload/base.email.payload';
import { NotificationEvent } from '@src/generated/alkemio-schema';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { NotificationBlacklistService } from './notification.blacklist.service';
import { EventPayloadNotProvidedException } from '@src/common/exceptions/event.payload.not.provided.exception';
import { Channel, Message } from 'amqplib';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { createHash } from 'crypto';
@Injectable()
export class NotificationService {
  // 034-messaging-notifications (FR-015/D-16): redeliveries beyond this cap
  // are rejected without requeue rather than looped forever.
  private static readonly MAX_REDELIVERY_ATTEMPTS = 3;

  // 034-messaging-notifications review fix (corr/spec/qual/sec
  // notifications-2/3): RabbitMQ only stamps an `x-death` header when a
  // message is actually dead-lettered — reject/nack with requeue=false into
  // a queue that carries an `x-dead-letter-exchange`, or TTL/queue-length
  // expiry. The `alkemio-notifications` queue (service/src/main.ts) declares
  // no dead-letter exchange, so `x-death` is NEVER present here and a count
  // read from it is always 0 — a cap keyed on it can never fire. The only
  // broker-native signal on this topology is `message.fields.redelivered`,
  // a boolean with no attempt count. The bound is therefore tracked
  // in-process, keyed by message identity (messageId/correlationId/content
  // hash). This resets on pod restart — a deliberate, minimal-effort bound;
  // a durable bound would need a queue-level dead-letter-exchange, which is
  // an infra change outside this repo.
  private readonly deliveryAttempts = new Map<string, number>();

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private notificationTemplateBuilder: NotificationTemplateBuilder,
    private notificationEmailPayloadBuilderService: NotificationEmailPayloadBuilderService,
    private notificationBlacklistService: NotificationBlacklistService
  ) {}

  public async processNotificationEvent(
    @Payload() eventPayload: BaseEventPayload,
    @Ctx() context: RmqContext
  ) {
    const eventName = eventPayload.eventType;
    this.logger.verbose?.(
      `[Event received: ${eventName}]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );

    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage() as Message;

    // 034-messaging-notifications (D-16 hardening, US1-AS2/AS3/US2-AS2
    // finding): buildAndSendEmailNotifications used to be awaited OUTSIDE
    // this try block, so an unexpected throw from it (e.g. the schema-drift
    // `.valueOf()` TypeError) propagated uncaught out of this handler
    // instead of being nack'd — leaving the message neither acked nor
    // nacked, which is what produced the unbounded implicit RabbitMQ
    // redelivery loop observed live. It is now inside the try, so any
    // unexpected error — from building/sending OR from the ack/nack
    // bookkeeping below — is always caught and the message is discarded
    // immediately (see the catch block below): a code/schema bug is very
    // likely to recur identically on every redelivery, so bounding-and-
    // retrying it buys nothing and risks a tight hot loop on this
    // single-replica consumer. Only the transient, all-recipients-failed
    // send path (e.g. an SMTP outage) is worth a few bounded retries.
    // https://www.squaremobius.net/amqp.node/channel_api.html#channel_nack
    try {
      const x = await this.buildAndSendEmailNotifications(eventPayload);
      if (x.length === 0) {
        this.logger.verbose?.(
          `[${eventPayload.eventType}] No messages to send!`,
          LogContext.NOTIFICATIONS
        );
        this.clearDeliveryAttempts(originalMsg);
        channel.ack(originalMsg);
        return;
      }
      const nacked = x.filter(
        (y: { status: string }) => y.status === 'rejected'
      ) as PromiseRejectedResult[];

      if (nacked.length === 0) {
        this.logger.verbose?.(
          `[${eventPayload.eventType}] ${x.length} messages successfully sent!`,
          LogContext.NOTIFICATIONS
        );
        // if all is fine, acknowledge the given message. allUpTo (second, optional parameter) defaults to false,
        // so only the message supplied is acknowledged.
        this.clearDeliveryAttempts(originalMsg);
        channel.ack(originalMsg);
      } else {
        if (nacked.length === x.length) {
          // 034-messaging-notifications (FR-015/D-16, risk R-12) — fixed
          // per corr/spec/qual/sec notifications-2/3 findings: the all-
          // failed path used to requeue unconditionally, which on a
          // single-replica consumer is an infinite redelivery loop. Bound
          // it using an in-process attempt count keyed by message identity
          // (see the class-level comment for why `x-death` cannot be used
          // on this queue); once that reaches the cap, reject WITHOUT
          // requeue (drop + log) instead of looping forever.
          const attempts = this.recordDeliveryAttempt(originalMsg);
          if (attempts >= NotificationService.MAX_REDELIVERY_ATTEMPTS) {
            this.logger.error(
              `[${eventPayload.eventType}] All messages failed to be sent after ${attempts} delivery attempts — rejecting without requeue to avoid an infinite redelivery loop.`,
              LogContext.NOTIFICATIONS
            );
            this.clearDeliveryAttempts(originalMsg);
            channel.reject(originalMsg, false);
          } else {
            this.logger.verbose?.('All messages failed to be sent!');
            // if all messages failed to be sent, we reject the message but we make sure the message is
            // not discarded so we provide 'true' to requeue parameter
            channel.reject(originalMsg, true);
          }
        } else {
          this.logger.verbose?.(
            `${nacked.length} messages out of total ${x.length} messages failed to be sent!`,
            LogContext.NOTIFICATIONS
          );
          // if at least one message is sent successfully, we acknowledge just this message but we make sure the message is
          // dead-lettered / discarded, providing 'false' to the 3rd parameter, requeue
          this.clearDeliveryAttempts(originalMsg);
          channel.nack(originalMsg, false, false);
        }
        // print all rejected notifications
        nacked.forEach(x => this.logger?.warn(x.reason));
      }
    } catch (err) {
      // 034-messaging-notifications review fix (corr-notifications-2,
      // qual-notifications-2, sec-notifications-1): an unexpected error
      // here (a code/schema bug, not a transient per-recipient send
      // failure — those are handled above via Promise.allSettled) is very
      // likely to recur identically on every redelivery. Requeueing it —
      // bounded or not — buys nothing and risks an unbounded hot loop on
      // this single-replica consumer, so discard immediately, matching the
      // pre-034 fail-safe behaviour on this path.
      this.logger.error(err);
      channel.nack(originalMsg, false, false);
    }
  }

  /**
   * Some events (the email-change security signal + new-address, and the
   * password-change security signal) are published raw — a flat
   * `{ recipientEmail, ... }` body without the BaseEventPayload envelope —
   * because the publishing service does not have a triggering user it can
   * cite. This wrapper injects the envelope so the raw payload flows through
   * the standard processNotificationEvent pipeline unchanged: sets eventType,
   * derives platform.url from config, adds a minimal triggeredBy stub, and
   * synthesizes a single recipient from `recipientEmail`. The synthetic
   * recipient deliberately omits `id` so the builder's notification-preferences
   * URL resolves to ''.
   */
  public normalizeRawRecipientEmailEvent(
    rawPayload: { recipientEmail: string },
    eventType: NotificationEvent
  ): BaseEventPayload {
    const recipientEmail = rawPayload?.recipientEmail?.trim();
    if (!recipientEmail) {
      throw new EventPayloadNotProvidedException(
        `recipientEmail missing for event: ${eventType}`,
        LogContext.NOTIFICATIONS
      );
    }

    const webclientEndpoint =
      this.configService.get(ConfigurationTypes.ALKEMIO)?.webclient_endpoint ??
      '';

    const syntheticRecipient = {
      email: recipientEmail,
      firstName: '',
      lastName: '',
      profile: { displayName: '', url: '' },
    } as BaseEventPayload['recipients'][number];

    return {
      ...rawPayload,
      eventType,
      triggeredBy: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        type: 'USER',
        profile: { displayName: '', url: '' },
      },
      recipients: [syntheticRecipient],
      platform: { url: webclientEndpoint },
    };
  }

  public async buildAndSendEmailNotifications(
    payload: BaseEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationTemplatesToSend: Promise<
      NotificationTemplateType | undefined
    >[] = [];

    if (!payload?.recipients || payload.recipients.length === 0) {
      this.logger.verbose?.(
        `[${payload.eventType}] - No recipients found, aborting notification sending.`,
        LogContext.NOTIFICATIONS
      );
      return [];
    }

    // Apply blacklist filtering to recipients
    const filteredRecipients =
      this.notificationBlacklistService.filterRecipients(payload.recipients);

    // Handle edge case: all recipients were blacklisted
    if (filteredRecipients.length === 0) {
      this.logger.verbose?.(
        `[${payload.eventType}] - All recipients were filtered by blacklist. No notifications will be sent.`,
        LogContext.NOTIFICATIONS
      );
      return [];
    }

    const emailTemplate = this.getEmailTemplateToUseForEvent(
      payload.eventType as NotificationEvent
    );

    for (const recipient of filteredRecipients) {
      const templatePayload = this.createEmailPayloadForEvent(
        payload,
        recipient
      );
      const emailNotificationTemplate =
        this.notificationTemplateBuilder.buildTemplate(
          emailTemplate,
          templatePayload
        );

      notificationTemplatesToSend.push(emailNotificationTemplate);
    }

    this.logger.verbose?.(
      ' ...building notifications - completed',
      LogContext.NOTIFICATIONS
    );

    // filter all rejected notifications and log them
    const notificationResults = await Promise.allSettled(
      notificationTemplatesToSend
    );
    const notificationTemplateTypes: NotificationTemplateType[] = [];
    notificationResults.forEach(notification => {
      if (this.isPromiseFulfilledResult(notification)) {
        const value = notification.value;
        if (value) notificationTemplateTypes.push(value);
      } else {
        this.logger.warn(
          `Filtering rejected notification content: ${notification.reason}`,
          LogContext.NOTIFICATIONS
        );
      }
    });
    try {
      return Promise.allSettled(
        notificationTemplateTypes.map(x => this.sendNotification(x))
      );
    } catch (error: any) {
      this.logger.error(error.message);
    }
    return [];
  }

  private async sendNotification(
    notification: NotificationTemplateType
  ): Promise<NotificationStatus> {
    if (!Object.keys(notification.channels).length) {
      throw new NotificationNoChannelsException(
        `Notification (${notification.name}) - (${notification.title}) no channels provided`
      );
    }
    // since this is the only channel we have; log an error if it's not provided
    if (!notification.channels.email) {
      this.logger.error?.(
        `Notification (${notification.name}) - (${notification.title}) no email channel provided`,
        LogContext.NOTIFICATIONS
      );
      return { status: 'error' };
    }

    const mailFrom = this.configService.get(
      ConfigurationTypes.NOTIFICATION_PROVIDERS
    )?.email?.from;
    const mailFromName = this.configService.get(
      ConfigurationTypes.NOTIFICATION_PROVIDERS
    )?.email?.from_name;

    if (!mailFrom) {
      this.logger.error?.(
        'Email from address not configured',
        LogContext.NOTIFICATIONS
      );
      return { status: 'error' };
    }

    const mailFromNameConfigured = mailFromName
      ? `${mailFromName} <${mailFrom}>`
      : mailFrom;

    notification.channels.email.from = mailFromNameConfigured;

    try {
      const res = await this.notifmeService.send(notification.channels);
      this.logger.verbose?.(
        `[${notification.name}] Notification sent from ${mailFromNameConfigured} - status: ${res.status}`,
        LogContext.NOTIFICATIONS
      );
      return res;
    } catch (reason) {
      this.logger.warn?.(
        `Notification rejected with reason: ${reason}`,
        LogContext.NOTIFICATIONS
      );
      return { status: 'error' };
    }
  }

  private createEmailPayloadForEvent(
    eventPayload: BaseEventPayload,
    recipient: User
  ): BaseEmailPayload {
    // Each eventPayload has the event type
    switch (eventPayload.eventType) {
      case NotificationEvent.SpaceAdminCommunityApplication:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminCommunityApplication(
          eventPayload as NotificationEventPayloadSpaceCommunityApplication,
          recipient
        );
      case NotificationEvent.UserSpaceCommunityInvitation:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitation,
          recipient
        );
      case NotificationEvent.UserSpaceCommunityApplicationDeclined:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined(
          eventPayload as NotificationEventPayloadSpaceCommunityApplication,
          recipient
        );
      case NotificationEvent.VirtualAdminSpaceCommunityInvitation:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadVirtualContributorInvitation(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
          recipient
        );
      case NotificationEvent.SpaceAdminVirtualCommunityInvitationDeclined:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadVirtualContributorInvitationDeclined(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
          recipient
        );
      case NotificationEvent.SpaceCommunityInvitationUserPlatform:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
          eventPayload as NotificationEventPayloadSpaceCommunityInvitationPlatform,
          recipient
        );
      case NotificationEvent.UserSpaceCommunityJoined:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSpaceCommunityJoined(
          eventPayload as NotificationEventPayloadSpaceCommunityContributor,
          recipient
        );
      case NotificationEvent.SpaceAdminCommunityNewMember:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminCommunityNewMember(
          eventPayload as NotificationEventPayloadSpaceCommunityContributor,
          recipient
        );
      case NotificationEvent.SpaceCommunityCalendarEventCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
          eventPayload as NotificationEventPayloadSpaceCalendarEvent,
          recipient
        );
      case NotificationEvent.SpaceCommunityCalendarEventComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunityCalendarEventComment(
          eventPayload as NotificationEventPayloadSpaceCalendarEvent,
          recipient
        );
      case NotificationEvent.PlatformAdminGlobalRoleChanged:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformGlobalRoleChange(
          eventPayload as NotificationEventPayloadPlatformGlobalRole,
          recipient
        );
      case NotificationEvent.UserSignUpWelcome:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserSignUpWelcome(
          eventPayload as NotificationEventPayloadPlatformUserRegistration,
          recipient
        );
      case NotificationEvent.PlatformAdminUserProfileCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformAdminUserProfileCreated(
          eventPayload as NotificationEventPayloadPlatformUserRegistration,
          recipient
        );
      case NotificationEvent.PlatformAdminUserProfileRemoved:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformUserRemoved(
          eventPayload as NotificationEventPayloadPlatformUserRemoved,
          recipient
        );
      case NotificationEvent.PlatformForumDiscussionComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformForumDiscussionComment(
          eventPayload as NotificationEventPayloadPlatformForumDiscussion,
          recipient
        );
      case NotificationEvent.PlatformForumDiscussionCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformForumDiscussionCreated(
          eventPayload as NotificationEventPayloadPlatformForumDiscussion,
          recipient
        );
      case NotificationEvent.SpaceCommunicationUpdate:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunicationUpdate(
          eventPayload as NotificationEventPayloadSpaceCommunicationUpdate,
          recipient
        );
      case NotificationEvent.UserMessage:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserMessage(
          eventPayload as NotificationEventPayloadUserMessageDirect,
          recipient
        );
      case NotificationEvent.UserConversationMessageDirect:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserConversationMessageDirect(
          eventPayload as NotificationEventPayloadUserConversationMessageDirect,
          recipient
        );
      case NotificationEvent.UserConversationMessageGroup:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserConversationMessageGroup(
          eventPayload as NotificationEventPayloadUserConversationMessageGroup,
          recipient
        );
      case NotificationEvent.OrganizationAdminMessage:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadOrganizationMessage(
          eventPayload as NotificationEventPayloadOrganizationMessageDirect,
          recipient
        );
      case NotificationEvent.OrganizationMessageSender:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadOrganizationMessageSender(
          eventPayload as NotificationEventPayloadOrganizationMessageDirect,
          recipient
        );
      case NotificationEvent.OrganizationAdminMentioned:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadOrganizationMention(
          eventPayload as NotificationEventPayloadOrganizationMessageRoom,
          recipient
        );
      case NotificationEvent.SpaceLeadCommunicationMessage:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCommunicationMessage(
          eventPayload as NotificationEventPayloadSpaceCommunicationMessageDirect,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutContribution:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceAdminCollaborationCalloutContribution:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutPostContributionComment:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.SpaceCollaborationCalloutPublished:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
          eventPayload as NotificationEventPayloadSpaceCollaborationCallout,
          recipient
        );
      case NotificationEvent.UserCommentReply:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserCommentReply(
          eventPayload as NotificationEventPayloadUserMessageRoomReply,
          recipient
        );
      case NotificationEvent.UserMentioned:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserMention(
          eventPayload as NotificationEventPayloadUserMessageRoom,
          recipient
        );
      case NotificationEvent.PlatformAdminSpaceCreated:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformAdminSpaceCreated(
          eventPayload as NotificationEventPayloadPlatformSpaceCreated,
          recipient
        );
      case NotificationEvent.SpaceCollaborationPollVoteCastOnOwnPoll:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
          eventPayload as NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
          recipient
        );
      case NotificationEvent.SpaceCollaborationPollVoteCastOnPollIVotedOn:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn(
          eventPayload as NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
          recipient
        );
      case NotificationEvent.SpaceCollaborationPollModifiedOnPollIVotedOn:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn(
          eventPayload as NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
          recipient
        );
      case NotificationEvent.SpaceCollaborationPollVoteAffectedByOptionChange:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange(
          eventPayload as NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
          recipient
        );
      case NotificationEvent.UserEmailChangeSecuritySignal:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserEmailChangeSecuritySignal(
          eventPayload as NotificationEventPayloadUserEmailChangeSecuritySignal &
            BaseEventPayload,
          recipient
        );
      case NotificationEvent.UserEmailChangeNewAddressNotification:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserEmailChangeNewAddress(
          eventPayload as NotificationEventPayloadUserEmailChangeNewAddress &
            BaseEventPayload,
          recipient
        );
      case NotificationEvent.UserEmailChangeGlobalAdminNotification:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadPlatformAdminUserEmailChange(
          eventPayload as NotificationEventPayloadUserEmailChangeGlobalAdmin,
          recipient
        );
      case NotificationEvent.UserEmailChangeSpaceAdminNotification:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadSpaceAdminUserEmailChange(
          eventPayload as NotificationEventPayloadUserEmailChangeSpaceAdmin,
          recipient
        );
      case NotificationEvent.UserPasswordChangeSecuritySignal:
        return this.notificationEmailPayloadBuilderService.createEmailTemplatePayloadUserPasswordChangeSecuritySignal(
          eventPayload as NotificationEventPayloadUserPasswordChangeSecuritySignal &
            BaseEventPayload,
          recipient
        );
      default:
        throw new EventPayloadNotProvidedException(
          `EmailPayload: Unable to recognize event:  ${eventPayload.eventType}`,
          LogContext.NOTIFICATION_BUILDER
        );
    }
  }

  // 034-messaging-notifications (D-16 hardening, prompted by US1-AS2/AS3/
  // US2-AS2/US4-AS5 live-verification findings): plain enum-member case
  // expressions, NOT `NotificationEvent.<Member>.valueOf()`. JS evaluates
  // switch case expressions top-to-bottom until a match; `.valueOf()` on a
  // stale/renamed/removed member throws `TypeError: Cannot read properties
  // of undefined (reading 'valueOf')` while evaluating THAT case, aborting
  // the whole switch — silently breaking every case listed after it (this is
  // exactly how a schema-drift typo here took out USER_CONVERSATION_MESSAGE_
  // DIRECT/GROUP, which sit later in source order). A bare enum reference
  // just yields `undefined` for a missing member — a case that can never
  // match, not a throw — so drift here can no longer cascade.
  private getEmailTemplateToUseForEvent(event: NotificationEvent): string {
    switch (event) {
      case NotificationEvent.SpaceAdminCommunityApplication:
        return 'space.admin.community.user.application.received';
      case NotificationEvent.UserSpaceCommunityInvitation:
        return 'user.space.community.invitation.received';
      case NotificationEvent.UserSpaceCommunityApplicationDeclined:
        return 'user.space.community.application.declined';
      case NotificationEvent.VirtualAdminSpaceCommunityInvitation:
        return 'virtual.contributor.invitation.received';
      case NotificationEvent.SpaceAdminVirtualCommunityInvitationDeclined:
        return 'virtual.contributor.invitation.declined';
      case NotificationEvent.SpaceCommunityInvitationUserPlatform:
        return 'user.space.community.invitation.received';
      case NotificationEvent.UserSpaceCommunityJoined:
        return 'user.space.community.joined';
      case NotificationEvent.SpaceAdminCommunityNewMember:
        return 'space.admin.community.new.member';
      case NotificationEvent.SpaceCommunityCalendarEventCreated:
        return 'space.community.calendar.event.created';
      case NotificationEvent.SpaceCommunityCalendarEventComment:
        return 'space.community.calendar.event.comment';
      case NotificationEvent.PlatformAdminGlobalRoleChanged:
        return 'platform.admin.user.global.role.change';
      case NotificationEvent.UserSignUpWelcome:
        return 'user.sign.up.welcome';
      case NotificationEvent.PlatformAdminUserProfileCreated:
        return 'platform.admin.user.profile.created';
      case NotificationEvent.PlatformAdminUserProfileRemoved:
        return 'platform.admin.user.profile.removed';
      case NotificationEvent.SpaceCommunicationUpdate:
        return 'space.communication.update.member';
      case NotificationEvent.PlatformForumDiscussionCreated:
        return 'platform.forum.discussion.created';
      case NotificationEvent.PlatformForumDiscussionComment:
        return 'platform.forum.discussion.comment';
      case NotificationEvent.UserMessage:
        return 'user.message.recipient';
      case NotificationEvent.UserConversationMessageDirect:
        return 'user.conversation.message.direct';
      case NotificationEvent.UserConversationMessageGroup:
        return 'user.conversation.message.group';
      case NotificationEvent.OrganizationAdminMessage:
        return 'organization.message.recipient';
      case NotificationEvent.OrganizationMessageSender:
        return 'organization.message.sender';
      case NotificationEvent.SpaceLeadCommunicationMessage:
        return 'space.lead.communication.message.direct.receiver';
      case NotificationEvent.UserMentioned:
        return 'user.mention';
      case NotificationEvent.OrganizationAdminMentioned:
        return 'organization.mention';
      case NotificationEvent.SpaceCollaborationCalloutComment:
        return 'space.collaboration.callout.comment';
      case NotificationEvent.SpaceCollaborationCalloutContribution:
        return 'space.collaboration.callout.contribution';
      case NotificationEvent.SpaceAdminCollaborationCalloutContribution:
        return 'space.admin.collaboration.callout.contribution';
      case NotificationEvent.SpaceCollaborationCalloutPostContributionComment:
        return 'space.collaboration.callout.post.contribution.comment';
      case NotificationEvent.SpaceCollaborationCalloutPublished:
        return 'space.collaboration.callout.published';
      case NotificationEvent.UserCommentReply:
        return 'user.comment.reply';
      case NotificationEvent.PlatformAdminSpaceCreated:
        return 'platform.admin.space.created';
      case NotificationEvent.SpaceCollaborationPollVoteCastOnOwnPoll:
        return 'space.collaboration.poll.vote.cast.on.own.poll';
      case NotificationEvent.SpaceCollaborationPollVoteCastOnPollIVotedOn:
        return 'space.collaboration.poll.vote.cast.on.poll.i.voted.on';
      case NotificationEvent.SpaceCollaborationPollModifiedOnPollIVotedOn:
        return 'space.collaboration.poll.modified.on.poll.i.voted.on';
      case NotificationEvent.SpaceCollaborationPollVoteAffectedByOptionChange:
        return 'space.collaboration.poll.vote.affected.by.option.change';
      case NotificationEvent.UserEmailChangeSecuritySignal:
        return 'user.email.change.security.signal';
      case NotificationEvent.UserEmailChangeNewAddressNotification:
        return 'user.email.change.new.address';
      case NotificationEvent.UserEmailChangeGlobalAdminNotification:
        return 'platform.admin.user.email.change';
      case NotificationEvent.UserEmailChangeSpaceAdminNotification:
        return 'space.admin.user.email.change';
      case NotificationEvent.UserPasswordChangeSecuritySignal:
        return 'user.password.change.security.signal';
      default:
        throw new EventPayloadNotProvidedException(
          `Email template: Unable to recognize event: ${event}`,
          LogContext.NOTIFICATION_BUILDER
        );
    }
  }

  private isPromiseFulfilledResult = (
    result: PromiseSettledResult<any>
  ): result is PromiseFulfilledResult<any> => result.status === 'fulfilled';

  // 034-messaging-notifications review fix (corr/spec/qual/sec
  // notifications-2/3): derives a stable identity for `message` so repeat
  // deliveries of the same event can be correlated in-process. Prefers the
  // AMQP `messageId`/`correlationId` properties (set by a well-behaved
  // publisher); falls back to a content hash so redeliveries of the exact
  // same payload still share a bound even without either property. A
  // message with neither an id nor a body (should not occur for a real
  // AMQP delivery) falls into one shared bucket rather than retrying
  // unbounded.
  private getMessageKey(message: Message): string {
    const properties = message?.properties as
      { messageId?: string; correlationId?: string } | undefined;
    if (properties?.messageId) {
      return `id:${properties.messageId}`;
    }
    if (properties?.correlationId) {
      return `corr:${properties.correlationId}`;
    }
    const content = (message as unknown as { content?: Buffer })?.content;
    if (content && content.length > 0) {
      return `content:${createHash('sha1').update(content).digest('hex')}`;
    }
    return 'unidentified';
  }

  /**
   * Records one more delivery/processing attempt for `message` and returns
   * the running count for its identity. See `getMessageKey` and the
   * class-level comment for why this is tracked in-process rather than via
   * RabbitMQ's `x-death` header (never populated on this queue).
   */
  private recordDeliveryAttempt(message: Message): number {
    const key = this.getMessageKey(message);
    const attempts = (this.deliveryAttempts.get(key) ?? 0) + 1;
    this.deliveryAttempts.set(key, attempts);
    return attempts;
  }

  /** Drops the tracked attempt count once a message will not be redelivered (acked, or given up on), bounding map growth. */
  private clearDeliveryAttempts(message: Message): void {
    this.deliveryAttempts.delete(this.getMessageKey(message));
  }
}
