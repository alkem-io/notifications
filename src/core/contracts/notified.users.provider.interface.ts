import { User } from '../models';
import { AuthorizationCredential } from '@alkemio/client-lib';

export interface INotifiedUsersProvider {
  getHubAdmins(hubID: string): Promise<User[]> | User[];
  getChallengeAdmins(challengeID: string): Promise<User[]> | User[];
  getOpportunityAdmins(opportunityID: string): Promise<User[]> | User[];
  getApplicant(payload: any): Promise<User> | User;
  getUsersWithCredentials(
    credential: AuthorizationCredential,
    resourceID?: string
  ): Promise<User[]>;
}
