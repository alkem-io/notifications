import { User } from '../models';
import { AuthorizationCredential } from '@alkemio/client-lib';

export interface INotifiedUsersProvider {
  getApplicant(payload: any): Promise<User> | User;
  getUsersMatchingCredentialCriteria(
    credentialType: AuthorizationCredential,
    credentialResourceID?: string
  ): Promise<User[]>;
}
