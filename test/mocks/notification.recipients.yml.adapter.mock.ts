import { Provider } from '@nestjs/common';
import { MockType } from '@test/utils/mock.type';
import { NotificationRecipientsYmlAdapter } from '@src/services';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@src/common';

export class MockNotificationRecipientsYmlAdapter
  implements MockType<NotificationRecipientsYmlAdapter>
{
  getTemplate() {
    throw new Error('Not supported');
  }
}

export const MockNotificationRecipientsYmlProvider: Provider = {
  provide: NotificationRecipientsYmlAdapter,
  useClass: MockNotificationRecipientsYmlAdapter,
};
