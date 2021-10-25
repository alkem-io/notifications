import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationService } from './services/notification/notification.service';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  @EventPattern('communityApplicationCreated')
  async sendApplicationNotification(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.notificationService.sendApplicationNotifications(data);
    } catch (error) {
      this.logger.error(error);

      //toDo check how to reject a message
      // channel.reject(originalMsg);
      return;
    }

    channel.ack(originalMsg);
  }
}
