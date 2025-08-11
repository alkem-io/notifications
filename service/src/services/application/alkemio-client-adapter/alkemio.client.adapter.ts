import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { PlatformFeatureFlagName } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER, LogContext } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Sdk } from '@src/generated/graphql';
import { NotSupportedException } from '@src/common/exceptions/not.supported.exception';
import { User } from '@src/core/models';

@Injectable()
export class AlkemioClientAdapter {
  constructor(
    @Inject(ALKEMIO_CLIENT_PROVIDER)
    private alkemioSdkClient: Sdk,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  async areNotificationsEnabled(): Promise<boolean> {
    if (!this.alkemioSdkClient) {
      this.logger.error(
        'Alkemio SDK Client is not initialised + set',
        LogContext.NOTIFICATIONS
      );
    }
    const featureFlagsResponse = await this.alkemioSdkClient.featureFlags();
    const featureFlags =
      featureFlagsResponse?.data.platform?.configuration?.featureFlags;
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

  public async getUser(userID: string): Promise<User> {
    if (userID && userID.length === 0) {
      throw new NotSupportedException(
        'User ID cannot be empty for looking up a user',
        LogContext.NOTIFICATIONS
      );
    }

    const userResponse = await this.alkemioSdkClient.userLookup({
      userID,
    });

    if (!userResponse.data.user) {
      throw new NotSupportedException(
        `User with ID ${userID} not found`,
        LogContext.NOTIFICATIONS
      );
    }

    const userResult: User = {
      id: userResponse.data.user.id,
      nameID: userResponse.data.user.nameID,
      profile: {
        displayName: userResponse.data.user.profile.displayName,
        url: userResponse.data.user.profile.url,
      },
      firstName: userResponse.data.user.firstName,
      lastName: userResponse.data.user.lastName,
      email: userResponse.data.user.email,
    };
    return userResult;
  }
}
