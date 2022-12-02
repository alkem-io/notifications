import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigurationTypes } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { JourneyPayload } from '@alkemio/notifications-lib';
import { CommunityType } from '@src/common/enums/community.type';

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

  createJourneyURL(journey: JourneyPayload): string {
    const baseURL = `${this.webclientEndpoint}/${journey.hubNameID}`;
    switch (journey.type) {
      case CommunityType.HUB:
        return baseURL;
      case CommunityType.CHALLENGE:
        return `${baseURL}/challenges/${journey.challenge?.nameID}`;
      case CommunityType.OPPORTUNITY:
        return `${baseURL}/challenges/${journey.challenge?.nameID}/opportunities/${journey.challenge?.opportunity?.nameID}`;
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
