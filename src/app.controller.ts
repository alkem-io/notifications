import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Channel, Message } from 'amqplib';
import { ALKEMIO_CLIENT_ADAPTER, LogContext } from './common';
import { IFeatureFlagProvider } from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { ApplicationCreatedNotifier } from './services';
import { UserRegistrationEventPayload } from './types';
import { UserRegistrationNotifier } from './services/domain/user-registration/user.registration.notifier';
import { CommunicationUpdateNotifier } from './services/domain/communication-update/communication.update.notifier';
import { CommunicationUpdateEventPayload } from './types/communication.update.event.payload';
import { CommunicationDiscussionCreatedEventPayload } from './types/communication.discussion.created.event.payload';
import { CommunicationDiscussionCreatedNotifier } from './services/domain/communication-discussion-created/communication.discussion.created.notifier';

@Controller()
export class AppController {
  constructor(
    private applicationCreatedNotifier: ApplicationCreatedNotifier,
    private userRegisteredNotifier: UserRegistrationNotifier,
    private communicationUpdateNotifier: CommunicationUpdateNotifier,
    private communicationDiscussionCreatedNotifier: CommunicationDiscussionCreatedNotifier,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly featureFlagProvider: IFeatureFlagProvider
  ) {}

  @EventPattern('communityApplicationCreated')
  async sendApplicationNotification(
    // todo is auto validation possible
    @Payload() eventPayload: ApplicationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotification(
      eventPayload,
      context,
      this.applicationCreatedNotifier,
      'communityApplicationCreated'
    );
  }
  @EventPattern('userRegistration')
  async sendUserRegisteredNotification(
    // todo is auto validation possible
    @Payload() eventPayload: UserRegistrationEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotification(
      eventPayload,
      context,
      this.userRegisteredNotifier,
      'userRegistration'
    );
  }

  @EventPattern('communicationUpdate')
  async sendCommunicationUpdateNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: CommunicationUpdateEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotification(
      eventPayload,
      context,
      this.communicationUpdateNotifier,
      'communicationUpdate'
    );
  }

  @EventPattern('communicationDiscussionCreated')
  async sendCommunicationDiscussionCreatedNotifications(
    // todo is auto validation possible
    @Payload() eventPayload: CommunicationDiscussionCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    this.sendNotification(
      eventPayload,
      context,
      this.communicationDiscussionCreatedNotifier,
      'communicationDiscussionCreated'
    );
  }

  private async sendNotification(
    @Payload() eventPayload: any,
    @Ctx() context: RmqContext,
    notifier: any,
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
    notifier
      .sendNotifications(eventPayload)
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
            channel.reject(originalMsg, true);
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
