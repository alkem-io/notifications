import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { AlkemioClient } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER, LogContext } from '@src/common';
import { IFeatureFlagProvider } from '@core/contracts';
import { CredentialCriteria, User } from '@core/models';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AlkemioClientAdapter implements IFeatureFlagProvider {
  constructor(
    @Inject(ALKEMIO_CLIENT_PROVIDER)
    private alkemioClient: AlkemioClient,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  async areNotificationsEnabled(): Promise<boolean> {
    const featureFlags = await this.alkemioClient.featureFlags();
    if (
      featureFlags?.find(x => x.name === 'notifications' && x.enabled === true)
    ) {
      return true;
    }
    this.logger.warn('Notifications are not enabled', LogContext.NOTIFICATIONS);
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
    let resourceID: string | undefined = undefined;
    if (credentialCriteria.resourceID)
      resourceID = credentialCriteria.resourceID;

    const users = await this.alkemioClient.usersWithAuthorizationCredential(
      credentialCriteria.type,
      resourceID,
      true
    );
    if (!users) return [];
    return users;
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
        if (user.email) uniqueUsers.push(user);
        else {
          this.logger.error(
            `The user: ${user.displayName} email could not be obtained!
            Please check the service account running the notifications service, it should have sufficient permissions to see the user email.`,
            LogContext.NOTIFICATIONS
          );
        }
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
