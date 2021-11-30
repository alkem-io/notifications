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
    const applicant = await this.tryGetUser(payload.applicantID, 0);
    if (!applicant)
      throw new Error(`Applicant with id: ${payload.applicantID} not found!`);

    return applicant;
  }

  async getApplicationCreator(payload: any): Promise<User> {
    const applicationCreator = await this.tryGetUser(
      payload.applicationCreatorID,
      0
    );
    if (!applicationCreator)
      throw new Error('The creator of the application was not found!');

    return applicationCreator;
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

  private async tryGetUser(
    userID: string,
    retry: number
  ): Promise<User | undefined> {
    let user = await this.alkemioClient.user(userID);
    if (!user && retry < 1) {
      await this.alkemioClient.enableAuthentication(); // workaround as currently the cli doesn't pass the error through}
      retry++;
      user = await this.tryGetUser(userID, retry);
    }

    return user;
  }
}
