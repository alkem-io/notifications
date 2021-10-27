import { Inject, Injectable } from '@nestjs/common';
import { AlkemioClient, AuthorizationCredential } from '@alkemio/client-lib';
import { INotifiedUsersProvider, IUser } from '@src/types';
import { ALKEMIO_CLIENT_PROVIDER } from '@src/common';

@Injectable()
export class AlkemioClientAdapter implements INotifiedUsersProvider {
  constructor(
    @Inject(ALKEMIO_CLIENT_PROVIDER)
    private alkemioClient: AlkemioClient
  ) {}
  async getApplicant(payload: any): Promise<IUser> {
    const applicant = await this.alkemioClient.user(payload.applicantID);
    if (!applicant) throw new Error('Applicant not found!');

    return applicant;
  }

  async getApplicationCreator(payload: any): Promise<IUser> {
    const applicationCreator = await this.alkemioClient.user(
      payload.applicationCreatorID
    );
    if (!applicationCreator)
      throw new Error('The creator of the application was  not found!');

    return applicationCreator;
  }

  async getOpportunityAdmins(opportunityID: string): Promise<IUser[]> {
    return await this.getAdmins(
      AuthorizationCredential.OpportunityAdmin,
      opportunityID
    );
  }

  async getHubAdmins(ecoverseID: string): Promise<IUser[]> {
    return await this.getAdmins(
      AuthorizationCredential.EcoverseAdmin,
      ecoverseID
    );
  }

  async getChallengeAdmins(challengeID: string): Promise<IUser[]> {
    return await this.getAdmins(
      AuthorizationCredential.OpportunityAdmin,
      challengeID
    );
  }

  private async getAdmins(
    credential: AuthorizationCredential,
    resourceID?: string
  ): Promise<IUser[]> {
    const admins = (await this.alkemioClient.usersWithAuthorizationCredential(
      credential,
      resourceID
    )) as IUser[];
    return admins;
  }
}
