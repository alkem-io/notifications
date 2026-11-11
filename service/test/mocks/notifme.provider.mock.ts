import { EmailSender } from '@src/services/notifme/email.sender';
import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { NOTIFICATIONS_PROVIDER } from '@common/enums';

export const MockNotifmeProvider: ValueProvider<PublicPart<EmailSender>> = {
  provide: NOTIFICATIONS_PROVIDER,
  useValue: {
    send: jest.fn(),
  },
};
