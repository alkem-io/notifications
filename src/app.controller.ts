import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Channel, Message } from 'amqplib';
import { ALKEMIO_CLIENT_ADAPTER, LogContext } from './common';
import { NotificationService } from '@src/services';
import { IFeatureFlagProvider } from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';

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
    this.logger.verbose?.(JSON.stringify(payload), LogContext.NOTIFICATIONS);

    const channel: Channel = context.getChannelRef();
    const originalMsg = context.getMessage() as Message;

    if (!(await this.featureFlagProvider.areNotificationsEnabled())) {
      channel.ack(originalMsg);
      return;
    }

    this.notificationService
      .sendApplicationNotifications(payload)
      .then(x => {
        const nacked = x.filter(y => y.status === 'rejected');

        if (nacked.length === 0) {
          this.logger.verbose?.(`All ${x.length} messages successfully sent!`);
          channel.ack(originalMsg);
        } else {
          this.logger.verbose?.(`${nacked.length} messages failed to be sent!`);
          //channel.nack(originalMsg);
          channel.ack(originalMsg);
        }
      })
      .catch(err => {
        //channel.reject(originalMsg);
        channel.ack(originalMsg);
        this.logger.error(err);
      });
  }
}
