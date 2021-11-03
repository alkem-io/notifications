import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types';

export type RecipientCredential = {
  role: AuthorizationCredential;
  resourceID?: string;
  isAdmin: boolean;
};

export interface INotificationRecipientProvider {
  getApplicationCreatedRecipients(
    payload: ApplicationCreatedEventPayload
  ): RecipientCredential[];
}
