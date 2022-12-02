import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigurationTypes } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { JourneyPayload, JourneyType } from '@alkemio/notifications-lib';

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

  createPlatformURL(): string {
    return this.webclientEndpoint;
  }

  createJourneyURL(journey: JourneyPayload): string {
    const baseURL = `${this.webclientEndpoint}/${journey.hubNameID}`;
    switch (journey.type) {
      case JourneyType.HUB:
        return baseURL;
      case JourneyType.CHALLENGE:
        return `${baseURL}/challenges/${journey.challenge?.nameID}`;
      case JourneyType.OPPORTUNITY:
        return `${baseURL}/challenges/${journey.challenge?.nameID}/opportunities/${journey.challenge?.opportunity?.nameID}`;
    }

    return baseURL;
  }

  createUserURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}`;
  }

  createCalloutURL(journeyURL: string, calloutNameID: string): string {
    return `${journeyURL}/callouts/${calloutNameID}`;
  }

  createCardURL(
    journeyURL: string,
    calloutNameID: string,
    cardNameID: string
  ): string {
    return `${journeyURL}/callouts/${calloutNameID}/aspects/${cardNameID}`;
  }

  createOrganizationURL(orgNameID: string): string {
    return `${this.webclientEndpoint}/organization/${orgNameID}`;
  }

  createUserNotificationPreferencesURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}/settings/notifications`;
  }
}
