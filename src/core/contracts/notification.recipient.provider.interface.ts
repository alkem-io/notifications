import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';
import { CredentialCriteria } from '../models/credential.criteria';

export interface INotificationRecipientProvider {
  getApplicationCreatedRecipients(
    payload: ApplicationCreatedEventPayload,
    roleName: string
  ): CredentialCriteria[];
}
