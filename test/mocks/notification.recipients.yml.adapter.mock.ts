import { Provider } from '@nestjs/common';
import { MockType } from '@test/utils/mock.type';
import { NotificationRecipientsYmlAdapter } from '@src/services';

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
