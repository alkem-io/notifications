import { Controller, Inject, LoggerService } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationService } from './services/notification.service';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}
  @MessagePattern()
  async sendNotification(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      await this.notificationService.sendNotification(data);
    } catch (error) {
      this.logger.error(error);
    }

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
