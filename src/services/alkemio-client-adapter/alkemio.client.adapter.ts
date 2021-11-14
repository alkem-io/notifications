import { Inject, Injectable } from '@nestjs/common';
import { AlkemioClient, AuthorizationCredential } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER } from '@src/common';
import { IFeatureFlagProvider, INotifiedUsersProvider } from '@core/contracts';
import { User } from '@core/models';

@Injectable()
export class AlkemioClientAdapter
  implements INotifiedUsersProvider, IFeatureFlagProvider
{
  constructor(
    @Inject(ALKEMIO_CLIENT_PROVIDER)
    private alkemioClient: AlkemioClient
  ) {}

  async areNotificationsEnabled(): Promise<boolean> {
    const featureFlags = await this.alkemioClient.featureFlags();
    if (
      featureFlags?.find(x => x.name === 'notifications' && x.enabled === true)
    )
      return true;
    return false;
  }

  async getApplicant(payload: any): Promise<User> {
    const applicant = await this.alkemioClient.user(payload.applicantID);
    if (!applicant)
      throw new Error(`Applicant with id: ${payload.applicantID} not found!`);

    return applicant;
  }

  async getApplicationCreator(payload: any): Promise<User> {
    const applicationCreator = await this.alkemioClient.user(
      payload.applicationCreatorID
    );
    if (!applicationCreator)
      throw new Error('The creator of the application was not found!');

    return applicationCreator;
  }

  async getOpportunityAdmins(opportunityID: string): Promise<User[]> {
    return await this.getUsersMatchingCredentialCriteria(
      AuthorizationCredential.OpportunityAdmin,
      opportunityID
    );
  }

  async getHubAdmins(ecoverseID: string): Promise<User[]> {
    return await this.getUsersMatchingCredentialCriteria(
      AuthorizationCredential.EcoverseAdmin,
      ecoverseID
    );
  }

  async getChallengeAdmins(challengeID: string): Promise<User[]> {
    return await this.getUsersMatchingCredentialCriteria(
      AuthorizationCredential.ChallengeAdmin,
      challengeID
    );
  }

  async getUsersMatchingCredentialCriteria(
    credential: AuthorizationCredential,
    resourceID?: string
  ): Promise<User[]> {
    return this.alkemioClient.usersWithAuthorizationCredential(
      credential,
      resourceID
    ) as Promise<User[]>;
  }
}
