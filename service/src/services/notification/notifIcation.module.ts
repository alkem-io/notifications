import { Module } from '@nestjs/common';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { NotificationBlacklistService } from './notification.blacklist.service';
import { NotificationService } from './notification.service';
import { NotifmeModule } from '../notifme/notifme.module';
import { BlacklistSyncService } from './blacklist-sync.service';

@Module({
  imports: [NotifmeModule],
  providers: [
    BlacklistSyncService,
    NotificationService,
    NotificationEmailPayloadBuilderService,
    NotificationBlacklistService,
  ],
  exports: [NotificationService, NotificationEmailPayloadBuilderService],
})
export class NotificationModule {}
