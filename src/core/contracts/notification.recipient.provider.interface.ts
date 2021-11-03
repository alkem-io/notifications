import { AuthorizationCredential } from '@alkemio/client-lib';

export type RecipientCredential = {
  role: AuthorizationCredential;
  resourceID?: string;
  isAdmin: boolean;
};

export interface INotificationRecipientProvider {
  // todo: define payload type
  getApplicationCreatedRecipients(payload: any): RecipientCredential[];
}
