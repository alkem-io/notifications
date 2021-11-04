import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Channel, Message } from 'amqplib';
import { ALKEMIO_CLIENT_ADAPTER } from './common';
import { NotificationService } from '@src/services';
import { IFeatureFlagProvider } from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly featureFlagProvider: IFeatureFlagProvider
  ) {}

  @EventPattern('communityApplicationCreated')
  async sendApplicationNotification(
    // todo is auto validation possible
    @Payload() payload: ApplicationCreatedEventPayload,
    @Ctx() context: RmqContext
  ) {
    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage() as Message;

    if (!(await this.featureFlagProvider.areNotificationsEnabled())) {
      //toDo make this nack
      channel.ack(originalMsg);
    }

    this.notificationService
      .sendApplicationNotifications(payload)
      .then(x => {
        const shouldNack = x.some(y => y.status === 'rejected');

        if (shouldNack) {
          //toDo make this nack
          channel.ack(originalMsg);
        } else {
          channel.ack(originalMsg);
        }
      })
      .catch(err => {
        this.logger.error(err);
        // toDo check how to reject a message
        // channel.reject(originalMsg);
      });
  }
}
