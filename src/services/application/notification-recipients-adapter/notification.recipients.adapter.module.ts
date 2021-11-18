import { Module } from '@nestjs/common';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@src/common';
import { NotificationRecipientsYmlAdapter } from './notification.recipients.yml.adapter';

@Module({
  providers: [
    {
      provide: NOTIFICATION_RECIPIENTS_YML_ADAPTER,
      useClass: NotificationRecipientsYmlAdapter,
    },
  ],
  exports: [NOTIFICATION_RECIPIENTS_YML_ADAPTER],
})
export class NotificationRecipientsAdapterModule {}
