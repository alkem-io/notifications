import { User } from './user';

export type EventRecipients = {
  emailRecipients: User[];
  inAppRecipients: User[];
  triggeredBy?: User;
};
