import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ALKEMIO_CLIENT_ADAPTER } from './common';
import { NotificationService } from './services/notification/notification.service';
import { IFeatureFlagProvider } from '@core/contracts';

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
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    if (await this.featureFlagProvider.areNotificationsEnabled()) {
      try {
        await this.notificationService.sendApplicationNotifications(data);
        channel.ack(originalMsg);
      } catch (error) {
        this.logger.error(error);

        //toDo check how to reject a message
        // channel.reject(originalMsg);
        return;
      }
    } else {
      //toDo make this nack
      channel.ack(originalMsg);
    }
  }
}
