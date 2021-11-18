import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';

export type RecipientCredential = {
  type: AuthorizationCredential;
  resourceID?: string;
};

export interface INotificationRecipientProvider {
  getApplicationCreatedRecipients(
    payload: ApplicationCreatedEventPayload,
    roleName: string
  ): RecipientCredential[];
}
