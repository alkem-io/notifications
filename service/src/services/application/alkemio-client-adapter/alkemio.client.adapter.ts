import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { AlkemioClient, PlatformFeatureFlagName } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER, LogContext } from '@common/enums';
import { IFeatureFlagProvider } from '@core/contracts';
import { CredentialCriterion, User } from '@core/models';
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
      featureFlags?.find(
        x =>
          x.name === PlatformFeatureFlagName.Notifications && x.enabled === true
      )
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
    credentialCriteria: CredentialCriterion
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
    credentialCriteria: CredentialCriterion[]
  ): Promise<User[]> {
    const users: User[] = [];
    for (const criterion of credentialCriteria) {
      const matchedUsers = await this.getUsersMatchingCredentialCriteria(
        criterion
      );
      users.push(...matchedUsers);
    }
    const uniqueUsers: User[] = [];
    for (const user of users) {
      const alreadyFound = uniqueUsers.find(
        uniqueUser => uniqueUser.id === user.id
      );
      if (!alreadyFound) {
        if (this.isEmailFormat(user.email)) uniqueUsers.push(user);
        else {
          this.logger.error(
            `Unable to obtain a valid email address for "${user.profile.displayName}": "${user.email}" is not a valid email address!
            Please check the service account running the notifications service, it must have sufficient permissions to see the user email.`,
            LogContext.NOTIFICATIONS
          );
        }
      }
    }
    return uniqueUsers;
  }

  private isEmailFormat(value: string): boolean {
    const emailRegex = /^\S+@\S+$/;
    return emailRegex.test(value);
  }

  private async tryGetUser(
    userID: string,
    retry: number
  ): Promise<User | undefined> {
    const user: User | undefined = await this.alkemioClient.user(userID);
    if (!user && retry < 1) {
      await this.alkemioClient.enableAuthentication(); // workaround as currently the cli doesn't pass the error through}
      retry++;
      return await this.tryGetUser(userID, retry);
    }

    return user;
  }
}
