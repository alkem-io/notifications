import { User } from '../models';

export interface INotifiedUsersProvider {
  getHubAdmins(hubID: string): Promise<User[]> | User[];
  getChallengeAdmins(challengeID: string): Promise<User[]> | User[];
  getOpportunityAdmins(opportunityID: string): Promise<User[]> | User[];
  getApplicant(payload: any): Promise<User> | User;
}
