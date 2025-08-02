import { EmailTemplate } from '@src/common/enums/email.template';
import { User } from './user';

export type EventEmailRecipients = {
  emailRecipients: User[];
  emailTemplate: EmailTemplate;
};
