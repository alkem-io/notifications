import { Module } from '@nestjs/common';
import { InAppNotificationSender } from './in.app.notification.sender.service';

@Module({
  imports: [],
  providers: [InAppNotificationSender],
  exports: [InAppNotificationSender],
})
export class InAppNotificationSenderModule {}
