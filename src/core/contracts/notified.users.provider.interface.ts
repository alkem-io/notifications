import { User } from '../models';
import { CredentialCriterion } from '../models/credential.criterion';
import { IFeatureFlagProvider } from './feature.flag.provider.interface';

export interface INotifiedUsersProvider extends IFeatureFlagProvider {
  getUser(userID: string): Promise<User>;
  getUniqueUsersMatchingCredentialCriteria(
    credentialCriterias: CredentialCriterion[]
  ): Promise<User[]>;
}
