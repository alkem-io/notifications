import { User } from '../models';
import { CredentialCriteria } from '../models/credential.criteria';
import { IFeatureFlagProvider } from './feature.flag.provider.interface';

export interface INotifiedUsersProvider extends IFeatureFlagProvider {
  getUser(userID: string): Promise<User>;
  getUniqueUsersMatchingCredentialCriteria(
    credentialCriterias: CredentialCriteria[]
  ): Promise<User[]>;
}
