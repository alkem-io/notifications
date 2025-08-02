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
  CollaborationCalloutPublishedEventPayload,
  CollaborationDiscussionCommentEventPayload,
  CollaborationPostCommentEventPayload,
  CollaborationPostCreatedEventPayload,
  CollaborationWhiteboardCreatedEventPayload,
  CommentReplyEventPayload,
  CommunicationCommunityLeadsMessageEventPayload,
  OrganizationMentionEventPayload,
  OrganizationMessageEventPayload,
  CommunicationUpdateEventPayload,
  CommunicationUserMentionEventPayload,
  UserMessageEventPayload,
  CommunityApplicationCreatedEventPayload,
  CommunityInvitationCreatedEventPayload,
  CommunityInvitationVirtualContributorCreatedEventPayload,
  CommunityNewMemberPayload,
  CommunityPlatformInvitationCreatedEventPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
  NotificationEventType,
  PlatformForumDiscussionCommentEventPayload,
  PlatformForumDiscussionCreatedEventPayload,
  PlatformGlobalRoleChangeEventPayload,
  PlatformUserRegistrationEventPayload,
  PlatformUserRemovedEventPayload,
  PlatformSpaceCreatedEventPayload,
} from '@alkemio/notifications-lib';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { INotificationBuilder } from '@core/contracts';
import {
  CollaborationCalloutPublishedNotificationBuilder,
  CollaborationPostCommentNotificationBuilder,
  CollaborationPostCreatedNotificationBuilder,
  CommunicationCommunityLeadsMessageNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  OrganizationMessageNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  CommunicationUserMentionNotificationBuilder,
  UserMessageNotificationBuilder,
  CommunityApplicationCreatedNotificationBuilder,
  CommunityInvitationCreatedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CommunityPlatformInvitationCreatedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';
import { PlatformUserRemovedNotificationBuilder } from '../builders/platform/platform.user.removed.notification.builder';
import { CollaborationWhiteboardCreatedNotificationBuilder } from '../builders/space/collaboration.whiteboard.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from '../builders/space/collaboration.discussion.comment.notification.builder';
import { CommentReplyNotificationBuilder } from '../builders/space/comment.reply.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from '../builders/platform/platform.global.role.change.notification.builder';
import { CommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/space/community.invitation.virtual.contributor.created.notification.builder';
import { PlatformSpaceCreatedNotificationBuilder } from '../builders/platform/platform.space.created.notification.builder';
import { ConfigService } from '@nestjs/config';
import { NotificationTemplateBuilder } from '@src/services/external/notifme/notification.templates.builder';
import { EventRecipientsSet } from '@src/core/models/EvenRecipientsSet';
import { InAppDispatcher } from '@src/services/dispatchers/in-app/in.app.dispatcher';
import { User } from '@src/core/models';
import e from 'express';
@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private readonly configService: ConfigService,
    private communityApplicationCreatedNotificationBuilder: CommunityApplicationCreatedNotificationBuilder,
    private communityInvitationCreatedNotificationBuilder: CommunityInvitationCreatedNotificationBuilder,
    private communityPlatformInvitationCreatedNotificationBuilder: CommunityPlatformInvitationCreatedNotificationBuilder,
    private communicationUpdatedNotificationBuilder: CommunicationUpdateCreatedNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: PlatformForumDiscussionCreatedNotificationBuilder,
    private communicationCommunityLeadsMessageNotificationBuilder: CommunicationCommunityLeadsMessageNotificationBuilder,
    private communicationUserMentionNotificationBuilder: CommunicationUserMentionNotificationBuilder,
    private communityNewMemberNotificationBuilder: CommunityNewMemberNotificationBuilder,
    private collaborationWhiteboardCreatedNotificationBuilder: CollaborationWhiteboardCreatedNotificationBuilder,
    private collaborationPostCreatedNotificationBuilder: CollaborationPostCreatedNotificationBuilder,
    private collaborationPostCommentNotificationBuilder: CollaborationPostCommentNotificationBuilder,
    private collaborationCalloutPublishedNotificationBuilder: CollaborationCalloutPublishedNotificationBuilder,
    private collaborationDiscussionCommentNotificationBuilder: CollaborationDiscussionCommentNotificationBuilder,
    private commentReplyNotificationBuilder: CommentReplyNotificationBuilder,
    private communityInvitationVirtualContributorCreatedNotificationBuilder: CommunityInvitationVirtualContributorCreatedNotificationBuilder,
    private platformGlobalRoleChangeNotificationBuilder: PlatformGlobalRoleChangeNotificationBuilder,
    private platformUserRegisteredNotificationBuilder: PlatformUserRegisteredNotificationBuilder,
    private platformUserRemovedNotificationBuilder: PlatformUserRemovedNotificationBuilder,
    private platformForumDiscussionCommentNotificationBuilder: PlatformForumDiscussionCommentNotificationBuilder,
    private platformSpaceCreatedNotificationBuilder: PlatformSpaceCreatedNotificationBuilder,
    private organizationMessageNotificationBuilder: OrganizationMessageNotificationBuilder,
    private organizationMentionNotificationBuilder: OrganizationMentionNotificationBuilder,
    private userMessageNotificationBuilder: UserMessageNotificationBuilder,
    private notificationTemplateBuilder: NotificationTemplateBuilder,
    private readonly inAppDispatcher: InAppDispatcher
  ) {}

  private async processNotificationEvent(
    payload: BaseEventPayload,
    builder: INotificationBuilder,
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const emailRecipientsSets = await builder.getEventRecipientSets(payload);
    const emailResults = await this.buildAndSendEmailNotifications(
      emailRecipientsSets,
      payload,
      builder,
    );
    const inAppNotificationResults = await this.buildAndSendInAppNotifications(
      emailRecipientsSets,
      payload,
      builder
    );

    return [...emailResults, ...inAppNotificationResults];
  }

  async sendApplicationCreatedNotifications(
    payload: CommunityApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityApplicationCreatedNotificationBuilder
    );
  }

  async sendInvitationCreatedNotifications(
    payload: CommunityInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityInvitationCreatedNotificationBuilder
    );
  }

  async sendVirtualContributorInvitationCreatedNotifications(
    payload: CommunityInvitationVirtualContributorCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityInvitationVirtualContributorCreatedNotificationBuilder
    );
  }

  async sendCommunityPlatformInvitationCreatedNotifications(
    payload: CommunityPlatformInvitationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityPlatformInvitationCreatedNotificationBuilder
    );
  }

  async sendCommunityNewMemberNotifications(
    payload: CommunityNewMemberPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communityNewMemberNotificationBuilder
    );
  }

  async sendPlatformGlobalRoleChangeNotification(
    payload: PlatformGlobalRoleChangeEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformGlobalRoleChangeNotificationBuilder
    );
  }

  async sendPlatformUserRegisteredNotification(
    payload: PlatformUserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRegisteredNotificationBuilder
    );
  }

  async sendPlatformUserRemovedNotification(
    payload: PlatformUserRemovedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformUserRemovedNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCommentNotification(
    payload: PlatformForumDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformForumDiscussionCommentNotificationBuilder
    );
  }

  async sendPlatformForumDiscussionCreatedNotification(
    payload: PlatformForumDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  async sendCommunicationUpdatedNotification(
    payload: CommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationUpdatedNotificationBuilder
    );
  }

  async sendUserMessageNotification(
    payload: UserMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.userMessageNotificationBuilder
    );
  }

  async sendOrganizationMessageNotification(
    payload: OrganizationMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMessageNotificationBuilder
    );
  }

  async sendOrganizationMentionNotification(
    payload: OrganizationMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.organizationMentionNotificationBuilder
    );
  }

  async sendCommunicationCommunityLeadsMessageNotification(
    payload: CommunicationCommunityLeadsMessageEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationCommunityLeadsMessageNotificationBuilder
    );
  }

  async sendCommunicationUserMentionNotification(
    payload: CommunicationUserMentionEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.communicationUserMentionNotificationBuilder
    );
  }

  async sendPostCreatedNotification(
    payload: CollaborationPostCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationPostCreatedNotificationBuilder
    );
  }

  async sendWhiteboardCreatedNotification(
    payload: CollaborationWhiteboardCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationWhiteboardCreatedNotificationBuilder
    );
  }

  async sendPostCommentCreatedNotification(
    payload: CollaborationPostCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationPostCommentNotificationBuilder
    );
  }

  async sendDiscussionCommentCreatedNotification(
    payload: CollaborationDiscussionCommentEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationDiscussionCommentNotificationBuilder
    );
  }

  async sendCalloutPublishedNotification(
    payload: CollaborationCalloutPublishedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.collaborationCalloutPublishedNotificationBuilder
    );
  }

  async sendCommentReplyNotification(
    payload: CommentReplyEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.commentReplyNotificationBuilder
    );
  }

  async sendPlatformSpaceCreatedNotification(
    payload: PlatformSpaceCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.processNotificationEvent(
      payload,
      this.platformSpaceCreatedNotificationBuilder
    );
  }

  private async buildAndSendInAppNotifications(
    eventRecipientsSets: EventRecipientsSet[],
    payload: BaseEventPayload,
    builder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notifications: InAppNotificationPayloadBase[] = [];
    for (const recipientSet of eventRecipientsSets) {
      const userIDs = recipientSet.inAppRecipients.map(
        recipient => recipient.id
      );

      const templatePayload = builder.createInAppTemplatePayload(
        payload,
        InAppNotificationCategory.ADMIN, // TODO: purpose of this category should be clarified
        userIDs
      );
      notifications.push(templatePayload);
    }

    try {
      this.inAppDispatcher.sendWithoutResponse(notifications);
    } catch (e: any) {
      this.logger.error(
        `${builder.constructor.name} failed to dispatch in-app notification`,
        e?.stack
      );
    }
    // TODO: get the right results from the dispatcher
    return [];
  }

  private async buildAndSendEmailNotifications(
    emailRecipientsSets: EventRecipientsSet[],
    payload: BaseEventPayload,
    builder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationTemplatesToSend: Promise<
      NotificationTemplateType | undefined
    >[] = [];
    for (const recipientSet of emailRecipientsSets) {
      for (const recipient of recipientSet.emailRecipients) {
        const templatePayload = builder.createEmailTemplatePayload(
          payload,
          recipient,
          recipientSet.triggeredBy
        );
        const emailNotificationTemplate =
          this.notificationTemplateBuilder.buildTemplate(
            recipientSet.emailTemplate,
            templatePayload
          );

        notificationTemplatesToSend.push(emailNotificationTemplate);
      }
    }
    this.logger.verbose?.(
      `[${NotificationEventType.COMMUNITY_APPLICATION_CREATED}] ...building notifications - completed`,
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
    this.logger.verbose?.(
      `Notification mail from ${mailFromNameConfigured}`,
      LogContext.NOTIFICATIONS
    );

    notification.channels.email.from = mailFromNameConfigured;

    return this.notifmeService.send(notification.channels).then(
      res => {
        this.logger.verbose?.(
          `Notification status: ${res.status}`,
          LogContext.NOTIFICATIONS
        );
        return res;
      },
      reason => {
        this.logger.warn?.(
          `Notification rejected with reason: ${reason}`,
          LogContext.NOTIFICATIONS
        );
        return { status: 'error' };
      }
    );
  }

  private isPromiseFulfilledResult = (
    result: PromiseSettledResult<any>
  ): result is PromiseFulfilledResult<any> => result.status === 'fulfilled';
}
