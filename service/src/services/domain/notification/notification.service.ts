import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NOTIFICATIONS_PROVIDER,
} from '@common/enums';
import {
  ApplicationCreatedEventPayload,
  CommunicationUpdateEventPayload,
  CommunicationDiscussionCreatedEventPayload,
  CommunityContextReviewSubmittedPayload,
  UserRegistrationEventPayload,
  CommunityNewMemberPayload,
  AspectCreatedEventPayload,
  AspectCommentCreatedEventPayload,
  CommunityCollaborationInterestPayload,
  CalloutPublishedEventPayload,
  BaseEventPayload,
} from '@common/dto';
import { AlkemioClientAdapter } from '@src/services/application/alkemio-client-adapter';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { INotificationBuilder } from '@core/contracts';
import {
  ApplicationCreatedNotificationBuilder,
  CommunicationDiscussionCreatedNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  UserRegisteredNotificationBuilder,
  CommunityContextReviewSubmittedNotificationBuilder,
  AspectCreatedNotificationBuilder,
  AspectCommentCreatedNotificationBuilder,
  CommunityCollaborationInterestNotificationBuilder,
  CalloutPublishedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
} from '../builders';
import { NotificationNoChannelsException } from '@src/common/exceptions';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly alkemioClientAdapter: AlkemioClientAdapter,
    @Inject(NOTIFICATIONS_PROVIDER)
    private readonly notifmeService: NotifmeSdk,
    private applicationCreatedNotificationBuilder: ApplicationCreatedNotificationBuilder,
    private userRegisteredNotificationBuilder: UserRegisteredNotificationBuilder,
    private communicationUpdatedNotificationBuilder: CommunicationUpdateCreatedNotificationBuilder,
    private communicationDiscussionCreatedNotificationBuilder: CommunicationDiscussionCreatedNotificationBuilder,
    private communityContextReviewSubmittedNotificationBuilder: CommunityContextReviewSubmittedNotificationBuilder,
    private communityNewMemberNotificationBuilder: CommunityNewMemberNotificationBuilder,
    private aspectCreatedNotificationBuilder: AspectCreatedNotificationBuilder,
    private aspectCommentCreatedNotificationBuilder: AspectCommentCreatedNotificationBuilder,
    private calloutPublishedNotificationBuilder: CalloutPublishedNotificationBuilder,
    private communityCollaborationInterestNotificationBuilder: CommunityCollaborationInterestNotificationBuilder
  ) {}

  async sendNotifications(
    payload: BaseEventPayload,
    notificationBuilder: INotificationBuilder
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    const notificationsEnabled =
      await this.alkemioClientAdapter.areNotificationsEnabled();
    if (!notificationsEnabled) {
      this.logger.verbose?.(
        'Notification disabled. No notifications are going to be built.',
        LogContext.NOTIFICATIONS
      );

      return [];
    }

    return notificationBuilder
      .build(payload)
      .then(x => x.map(y => this.sendNotification(y)))
      .then(x => Promise.allSettled(x))
      .catch((error: Error) => this.logger.error(error.message));
  }

  async sendApplicationCreatedNotifications(
    payload: ApplicationCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.applicationCreatedNotificationBuilder
    );
  }

  async sendCommunityNewMemberNotifications(
    payload: CommunityNewMemberPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityNewMemberNotificationBuilder
    );
  }

  async sendUserRegisteredNotification(
    payload: UserRegistrationEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.userRegisteredNotificationBuilder
    );
  }

  async sendCommunicationUpdatedNotification(
    payload: CommunicationUpdateEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationUpdatedNotificationBuilder
    );
  }

  async sendCommunicationDiscussionCreatedNotification(
    payload: CommunicationDiscussionCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communicationDiscussionCreatedNotificationBuilder
    );
  }

  async sendCommunityContextFeedbackNotification(
    payload: CommunityContextReviewSubmittedPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityContextReviewSubmittedNotificationBuilder
    );
  }

  async sendAspectCreatedNotification(
    payload: AspectCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.aspectCreatedNotificationBuilder
    );
  }

  async sendAspectCommentCreatedNotification(
    payload: AspectCommentCreatedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.aspectCommentCreatedNotificationBuilder
    );
  }

  async sendCalloutPublishedNotification(
    payload: CalloutPublishedEventPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.calloutPublishedNotificationBuilder
    );
  }

  async sendCommunityCollaborationInterestNotification(
    payload: CommunityCollaborationInterestPayload
  ): Promise<PromiseSettledResult<NotificationStatus>[]> {
    return this.sendNotifications(
      payload,
      this.communityCollaborationInterestNotificationBuilder
    );
  }

  private async sendNotification(
    notification: NotificationTemplateType
  ): Promise<NotificationStatus> {
    if (!Object.keys(notification.channels).length) {
      throw new NotificationNoChannelsException(
        `Notification (${notification.name}) - (${notification.title}) no channels provided`
      );
    }

    return this.notifmeService.send(notification.channels).then(
      res => {
        this.logger.verbose?.(
          `Notification status: ${res.status}`,
          LogContext.NOTIFICATIONS
        );
        return res;
      },
      reason => {
        this.logger.verbose?.(
          `Notification rejected with reason: ${reason}`,
          LogContext.NOTIFICATIONS
        );
        return reason;
      }
    );
  }
}
