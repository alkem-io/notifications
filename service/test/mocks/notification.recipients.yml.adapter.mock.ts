import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils/public-part';
import { NotificationRecipientsYmlAdapter } from '@src/services';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@common/enums';

export const MockNotificationRecipientsYmlProvider: ValueProvider<
  PublicPart<NotificationRecipientsYmlAdapter>
> = {
  provide: NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  useValue: {
    getTemplate: jest.fn(),
    getCredentialCriteria: jest.fn(),
  },
};
