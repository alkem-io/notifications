import { User } from '../models';
import { CredentialCriteria } from '../models/credential.criteria';

export interface INotifiedUsersProvider {
  getUser(userID: string): Promise<User>;
  getUniqueUsersMatchingCredentialCriteria(
    credentialCriterias: CredentialCriteria[]
  ): Promise<User[]>;
}
