import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigurationTypes } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import {
  JourneyPayload,
  createJourneyURL as libCreateJourneyURL,
  createJourneyAdminCommunityURL as libCreateJourneyAdminCommunityURL,
  createUserURL as libCreateUserURL,
  createCalloutURL as libCreateCalloutURL,
  createPostURL as libCreatePostURL,
  createWhiteboardURL as libCreateWhiteboardURL,
  createOrganizationURL as libCreateOrganizationURL,
  createUserNotificationPreferencesURL as libCreateUserNotificationPreferencesURL,
} from '@alkemio/notifications-lib';
import { ExternalUser, User, isUser } from '@src/core/models';

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
    console.log(
      '\n\n alkemio config:',
      this.configService.get(ConfigurationTypes.ALKEMIO)
    );
  }

  createPlatformURL(): string {
    return this.webclientEndpoint;
  }

  createJourneyURL(journey: JourneyPayload): string {
    return libCreateJourneyURL(this.webclientEndpoint, journey);
  }

  createJourneyAdminCommunityURL(journey: JourneyPayload): string {
    return libCreateJourneyAdminCommunityURL(this.webclientEndpoint, journey);
  }

  createUserURL(userNameID: string): string {
    console.log('\n\n\nwebclientEndpoint:', this.webclientEndpoint);
    console.log('\n\n\n');
    return libCreateUserURL(this.webclientEndpoint, userNameID);
  }

  createCalloutURL(journeyURL: string, calloutNameID: string): string {
    return libCreateCalloutURL(journeyURL, calloutNameID);
  }

  createPostURL(
    journeyURL: string,
    calloutNameID: string,
    postNameID: string
  ): string {
    return libCreatePostURL(journeyURL, calloutNameID, postNameID);
  }

  createWhiteboardURL(
    journeyURL: string,
    calloutNameID: string,
    whiteboardNameID: string
  ): string {
    return libCreateWhiteboardURL(journeyURL, calloutNameID, whiteboardNameID);
  }

  createOrganizationURL(orgNameID: string): string {
    return libCreateOrganizationURL(this.webclientEndpoint, orgNameID);
  }

  createUserNotificationPreferencesURL(user: User | ExternalUser): string {
    return isUser(user)
      ? libCreateUserNotificationPreferencesURL(
          this.webclientEndpoint,
          user.nameID
        )
      : '';
  }
}
