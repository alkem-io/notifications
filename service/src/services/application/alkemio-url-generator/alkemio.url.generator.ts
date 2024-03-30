import { Injectable } from '@nestjs/common';
import { ConfigurationTypes } from '@common/enums';
import { ConfigService } from '@nestjs/config';
import { ExternalUser, User, isUser } from '@src/core/models';

@Injectable()
export class AlkemioUrlGenerator {
  webclientEndpoint: string;
  constructor(private configService: ConfigService) {
    this.webclientEndpoint = this.configService.get(
      ConfigurationTypes.ALKEMIO
    )?.webclient_endpoint;
  }

  createUserNotificationPreferencesURL(user: User | ExternalUser): string {
    return isUser(user)
      ? this.createAlkemioUserNotificationPreferencesURL(
          this.webclientEndpoint,
          user.nameID
        )
      : '';
  }

  createAlkemioUserNotificationPreferencesURL = (
    webclientEndpoint: string,
    userNameID: string
  ): string => {
    return `${webclientEndpoint}/user/${userNameID}/settings/notifications`;
  };
}
