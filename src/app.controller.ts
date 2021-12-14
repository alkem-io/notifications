import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Channel, Message } from 'amqplib';
import {
  ALKEMIO_CLIENT_ADAPTER,
  COMMUNICATION_DISCUSSION_CREATED,
  COMMUNICATION_UPDATE_SENT,
  COMMUNITY_APPLICATION_CREATED,
  LogContext,
  USER_REGISTERED,
} from './common';
import { IFeatureFlagProvider } from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { UserRegistrationEventPayload } from './types';
import { CommunicationUpdateEventPayload } from './types/communication.update.event.payload';
import { CommunicationDiscussionCreatedEventPayload } from './types/communication.discussion.created.event.payload';
import { NotificationService } from './services/domain/notification/notification.service';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly featureFlagProvider: IFeatureFlagProvider
  ) {}

  @EventPattern(COMMUNITY_APPLICATION_CREATED)
  async sendApplicationNotification(
    // todo is auto validation possible
    @Payload() eventPayload: ApplicationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendApplicationCreatedNotifications(
        eventPayload
      ),
      COMMUNITY_APPLICATION_CREATED
    );
  }
  @EventPattern(USER_REGISTERED)
  async sendUserRegisteredNotification(
    // todo is auto validation possible
    @Payload() eventPayload: UserRegistrationEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendUserRegisteredNotification(eventPayload),
      USER_REGISTERED
    );
  }

  @EventPattern(COMMUNICATION_UPDATE_SENT)
  async sendCommunicationUpdatedNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: CommunicationUpdateEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationUpdatedNotification(
        eventPayload
      ),
      COMMUNICATION_UPDATE_SENT
    );
  }

  @EventPattern(COMMUNICATION_DISCUSSION_CREATED)
  async sendCommunicationDiscussionCreatedNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: CommunicationDiscussionCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotifications(
      eventPayload,
      context,
      this.notificationService.sendCommunicationDiscussionCreatedNotification(
        eventPayload
      ),
      COMMUNICATION_DISCUSSION_CREATED
    );
  }

  private async sendNotifications(
    @Payload() eventPayload: any,
    @Ctx() context: RmqContext,
    // notificationBuilder: any,
    sendNotifications: any,
    eventName: string
  ) {
    this.logger.verbose?.(
      `[Event received: ${eventName}]: ${JSON.stringify(eventPayload)}`,
      LogContext.NOTIFICATIONS
    );

    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage() as Message;

    if (!(await this.featureFlagProvider.areNotificationsEnabled())) {
      channel.ack(originalMsg);
      return;
    }

    // https://www.squaremobius.net/amqp.node/channel_api.html#channel_nack
    sendNotifications
      .then((x: any[]) => {
        const nacked = x.filter(
          (y: { status: string }) => y.status === 'rejected'
        );

        if (nacked.length === 0) {
          this.logger.verbose?.(`All ${x.length} messages successfully sent!`);
          // if all is fine, acknowledge the given message. allUpTo (second, optional parameter) defaults to false,
          // so only the message supplied is acknowledged.
          channel.ack(originalMsg);
        } else {
          if (nacked.length === x.length) {
            this.logger.verbose?.('All messages failed to be sent!');
            // if all messages failed to be sent, we reject the message but we make sure the message is
            // not discarded so we provide 'true' to requeue parameter
            channel.nack(originalMsg, false, false);
            // channel.reject(originalMsg, true);
          } else {
            this.logger.verbose?.(
              `${nacked.length} messages out of total ${x.length} messages failed to be sent!`
            );
            // if at least one message is sent successfully, we acknowledge just this message but we make sure the message is
            // dead-lettered / discarded, providing 'false' to the 3rd parameter, requeue
            channel.nack(originalMsg, false, false);
          }
        }
      })
      .catch((err: any) => {
        // if there is an unhandled bug in the flow, we reject the message but we make sure the message is
        // not discarded so we provide 'true' to requeue parameter
        // channel.reject(originalMsg, true);
        channel.nack(originalMsg, false, false);
        this.logger.error(err);
      });
  }
}
