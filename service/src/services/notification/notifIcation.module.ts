import { Module } from '@nestjs/common';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { NotificationBlacklistService } from './notification.blacklist.service';
import { NotificationService } from './notification.service';
import { NotifmeModule } from '../notifme/notifme.module';

@Module({
  imports: [NotifmeModule],
  providers: [
    NotificationService,
    NotificationEmailPayloadBuilderService,
    NotificationBlacklistService,
  ],
  exports: [NotificationService, NotificationEmailPayloadBuilderService],
})
export class NotificationModule {}
