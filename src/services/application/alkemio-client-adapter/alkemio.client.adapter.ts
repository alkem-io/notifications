import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { AlkemioClient } from '@alkemio/client-lib';
import {
  ALKEMIO_CLIENT_PROVIDER,
  ConfigurationTypes,
  LogContext,
} from '@src/common';
import { IFeatureFlagProvider } from '@core/contracts';
import { CredentialCriteria, User } from '@core/models';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlkemioClientAdapter implements IFeatureFlagProvider {
  webclientEndpoint: string;
  constructor(
    @Inject(ALKEMIO_CLIENT_PROVIDER)
    private alkemioClient: AlkemioClient,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService
  ) {
    this.webclientEndpoint = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_endpoint;
  }

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

  createCommunityURL(
    hubNameID: string,
    challengeNameID?: string,
    opportunityNameID?: string
  ): string {
    const baseURL = `${this.webclientEndpoint}/${hubNameID}`;
    if (opportunityNameID) {
      return `${baseURL}/${challengeNameID}/${opportunityNameID}`;
    }
    if (challengeNameID) {
      return `${baseURL}/${challengeNameID}`;
    }
    return baseURL;
  }

  createUserURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}`;
  }

  createOrganizationURL(orgNameID: string): string {
    return `${this.webclientEndpoint}/organization/${orgNameID}`;
  }
}
