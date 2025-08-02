import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { PlatformFeatureFlagName } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER, LogContext } from '@common/enums';
import { IFeatureFlagProvider } from '@core/contracts';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Sdk, UserNotificationEvent } from '@src/generated/graphql';
import { EventRecipients } from '@src/core/models/EventRecipients';

@Injectable()
export class AlkemioClientAdapter implements IFeatureFlagProvider {
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

  public async getRecipients(
    eventType: UserNotificationEvent,
    entityId: string | undefined,
    triggeredBy?: string
  ): Promise<EventRecipients> {
    const recipients = await this.alkemioSdkClient.notificationRecipients({
      eventType,
      entityId,
      triggeredBy,
    });
    return {
      emailRecipients:
        recipients?.data?.notificationRecipients.emailRecipients || [],
      inAppRecipients:
        recipients?.data?.notificationRecipients.inAppRecipients || [],
      triggeredBy: recipients?.data?.notificationRecipients.triggeredBy,
    };
  }
}
