import { Inject, Injectable } from '@nestjs/common';
import { AlkemioClient } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER } from '@src/common';
import { IFeatureFlagProvider, INotifiedUsersProvider } from '@core/contracts';
import { CredentialCriteria, User } from '@core/models';

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

  async getUser(userID: string): Promise<User> {
    const applicant = await this.tryGetUser(userID, 0);
    if (!applicant) throw new Error(`User with id: ${userID} not found!`);

    return applicant;
  }

  async getUsersMatchingCredentialCriteria(
    credentialCriteria: CredentialCriteria
  ): Promise<User[]> {
    return this.alkemioClient.usersWithAuthorizationCredential(
      credentialCriteria.type,
      credentialCriteria.resourceID
    ) as Promise<User[]>;
  }

  async getUniqueUsersMatchingCredentialCriteria(
    credentialCriterias: CredentialCriteria[]
  ): Promise<User[]> {
    const users: User[] = [];
    for (const criteria of credentialCriterias) {
      const matchedUsers = await this.getUsersMatchingCredentialCriteria(
        criteria
      );
      users.push(...matchedUsers);
    }
    const uniqueUsers: User[] = [];
    for (const user of users) {
      const alreadyFound = uniqueUsers.find(
        uniqueUser => uniqueUser.id === user.id
      );
      if (!alreadyFound) {
        uniqueUsers.push(user);
      }
    }
    return uniqueUsers;
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
