export interface IUser {
  id: string;
  nameID: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
}

export interface INotifiedUsersProvider {
  getHubAdmins(hubID: string): Promise<IUser[]> | IUser[];
  getChallengeAdmins(challengeID: string): Promise<IUser[]> | IUser[];
  getOpportunityAdmins(opportunityID: string): Promise<IUser[]> | IUser[];
  getApplicant(payload: any): Promise<IUser> | IUser;
}

export interface IFeatureFlagProvider {
  areNotificationsEnabled(): Promise<boolean>;
}
