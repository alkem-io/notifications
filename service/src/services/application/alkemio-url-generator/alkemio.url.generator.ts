import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigurationTypes } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { JourneyPayload, JourneyType } from '@alkemio/notifications-lib';
// TODO: generator functions to be imported from lib
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

  createJourneyAdminCommunityURL(journey: JourneyPayload): string {
    const baseURL = `${this.webclientEndpoint}/admin/hubs/${journey.hubNameID}`;
    switch (journey.type) {
      case JourneyType.HUB:
        return `${baseURL}/community`;
      case JourneyType.CHALLENGE:
        return `${baseURL}/challenges/${journey.challenge?.nameID}/community`;
      case JourneyType.OPPORTUNITY:
        return `${baseURL}/challenges/${journey.challenge?.nameID}/opportunities/${journey.challenge?.opportunity?.nameID}/community`;
    }

    return baseURL;
  }

  createUserURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}`;
  }

  createCalloutURL(journeyURL: string, calloutNameID: string): string {
    return `${journeyURL}/contribute/callouts/${calloutNameID}`;
  }

  createCardURL(
    journeyURL: string,
    calloutNameID: string,
    cardNameID: string
  ): string {
    return `${journeyURL}/contribute/callouts/${calloutNameID}/aspects/${cardNameID}`;
  }

  createCanvasURL(
    journeyURL: string,
    calloutNameID: string,
    canvasNameID: string
  ): string {
    return `${journeyURL}/contribute/callouts/${calloutNameID}/canvases/${canvasNameID}`;
  }

  createOrganizationURL(orgNameID: string): string {
    return `${this.webclientEndpoint}/organization/${orgNameID}`;
  }

  createUserNotificationPreferencesURL(userNameID: string): string {
    return `${this.webclientEndpoint}/user/${userNameID}/settings/notifications`;
  }
}
