import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigurationTypes } from '@src/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlkemioUrlGenerator {
  webclientEndpoint: string;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService
  ) {
    this.webclientEndpoint = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_endpoint;
  }

  createHubURL(): string {
    return this.webclientEndpoint;
  }

  createCommunityURL(
    hubNameID: string,
    challengeNameID?: string,
    opportunityNameID?: string
  ): string {
    const baseURL = `${this.webclientEndpoint}/${hubNameID}`;
    if (opportunityNameID) {
      return `${baseURL}/challenges/${challengeNameID}/opportunities/${opportunityNameID}`;
    }
    if (challengeNameID) {
      return `${baseURL}/challenges/${challengeNameID}`;
    }
    return baseURL;
  }

  createUserURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}`;
  }

  createOrganizationURL(orgNameID: string): string {
    return `${this.webclientEndpoint}/organization/${orgNameID}`;
  }

  createUserNotificationPreferencesURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}/settings/notifications`;
  }
}
