import { EmailTemplate } from '@src/common/enums/email.template';
import { User } from './user';

export type EventRecipientsSet = {
  emailRecipients: User[];
  emailTemplate: EmailTemplate;
  inAppRecipients: User[];
};
