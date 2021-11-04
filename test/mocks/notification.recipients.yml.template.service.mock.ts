import { Provider } from '@nestjs/common';
import { MockType } from '@test/utils/mock.type';
import { NotificationRecipientsYmlTemplate } from '@src/services';

class MockNotificationRecipientsYmlTemplate
  implements MockType<NotificationRecipientsYmlTemplate>
{
  getTemplate() {
    throw new Error('Not supported');
  }
}

export const MockNotificationRecipientsYmlTemplateProvider: Provider = {
  provide: NotificationRecipientsYmlTemplate,
  useClass: MockNotificationRecipientsYmlTemplate,
};
