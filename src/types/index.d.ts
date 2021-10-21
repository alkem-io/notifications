export interface IUser {
  id: string;
  nameID: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
}

export interface INotifiedUsersProvider {
  getHubAdmins(hubID: string): Promise<IUser[]>;
  getChallengeAdmins(challengeID: string): Promise<IUser[]>;
  getOpportunityAdmins(opportunityID: string): Promise<IUser[]>;
  getApplicant(payload: any): Promise<IUser>;
}
