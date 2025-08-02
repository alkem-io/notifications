import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { PlatformFeatureFlagName } from '@alkemio/client-lib';
import { ALKEMIO_CLIENT_PROVIDER, LogContext } from '@common/enums';
import { IFeatureFlagProvider } from '@core/contracts';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Sdk, UserNotificationEvent } from '@src/generated/graphql';
import { EventRecipients } from '@src/core/models/EventRecipients';
import e from 'express';
import { NotSupportedException } from '@src/common/exceptions/not.supported.exception';

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
    if (entityId && entityId.length === 0) {
      throw new NotSupportedException(
        `Entity ID cannot be empty for event type: ${eventType}`,
        LogContext.NOTIFICATIONS
      );
    }

    const recipients = await this.alkemioSdkClient.notificationRecipients({
      eventType,
      entityId,
      triggeredBy,
    });
    const notificationRecipientsResponse =
      recipients?.data?.notificationRecipients;
    this.logger.verbose?.(
      `Fetched recipients for event type: ${eventType}, entityId: ${entityId}, triggeredBy: ${triggeredBy}: emails recipients: ${notificationRecipientsResponse.emailRecipients.length}, in-app recipients: ${notificationRecipientsResponse.inAppRecipients.length}`,
      LogContext.NOTIFICATIONS
    );
    return {
      emailRecipients: notificationRecipientsResponse.emailRecipients || [],
      inAppRecipients: notificationRecipientsResponse.inAppRecipients || [],
      triggeredBy: notificationRecipientsResponse.triggeredBy,
    };
  }
}
