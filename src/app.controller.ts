import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { NotificationService } from './services/notification.service';

@Controller()
export class AppController {
  constructor(private notificationService: NotificationService) {}
  @MessagePattern()
  async getNotifications(@Payload() data: any, @Ctx() context: RmqContext) {
    try {
      await this.notificationService.sendNotification(data);
    } catch (error) {}

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
