import { Module } from '@nestjs/common';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@src/common';
import { MockNotificationRecipientsYmlAdapter } from './notification.recipients.yml.adapter.mock';

@Module({
  providers: [
    {
      provide: NOTIFICATION_RECIPIENTS_YML_ADAPTER,
      useClass: MockNotificationRecipientsYmlAdapter,
    },
  ],
  exports: [NOTIFICATION_RECIPIENTS_YML_ADAPTER],
})
export class MockNotificationRecipientsAdapterModule {}
