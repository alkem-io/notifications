import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER, LogContext } from '@common/enums';
import { AlkemioClientAdapter } from '@src/services';
import {
  BaseEventPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationPayloadBase,
} from '@alkemio/notifications-lib';
import {
  AuthorizationCredential,
  UserPreferenceType,
} from '@alkemio/client-lib';
import { InAppReceiverConfig } from '../in.app.receiver.config';
import { InAppPayloadBuilderFn } from '../in.app.payload.builder.fn';

@Injectable()
export class InAppBuilderUtil {
  constructor(
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
  ) {}

  public async genericBuild<
    TEvent extends BaseEventPayload,
    TPayload extends InAppNotificationPayloadBase
  >(
    config: InAppReceiverConfig[],
    event: TEvent,
    payloadBuilder: InAppPayloadBuilderFn<TEvent, TPayload>
  ): Promise<CompressedInAppNotificationPayload<TPayload>[]> {
    const notifications: CompressedInAppNotificationPayload<TPayload>[] = [];
    for (const { category, credential, preferenceType } of config) {
      // get receivers for this role
      const receiversByCategory = await this.getReceivers({
        credential,
        preferenceType,
      });
      // do not continue if there are no receivers
      if (receiversByCategory.length === 0) {
        this.logger.verbose?.(
          `Skipping in-app notification for receivers with preference '${preferenceType}' and category of '${category}' because there are not any`,
          LogContext.IN_APP_BUILDER
        );
        continue;
      }
      // build notifications per roleConfig entry
      const compressedNotification = payloadBuilder(
        category,
        receiversByCategory,
        event
      );

      if (this.logger.verbose) {
        this.logger.verbose(
          `Built in-app notification of type '${compressedNotification.type}' and category '${category}' for ${compressedNotification.receiverIDs.length} receivers`,
          LogContext.IN_APP_BUILDER
        );
      }

      notifications.push(compressedNotification);
    }

    return notifications;
  }

  /**
   * Gets the users for a given credential and filters them by preference
   * @param options
   * @private
   * @returns Fully qualified receivers in a list of user IDs
   */
  private async getReceivers(options: {
    credential: {
      type: AuthorizationCredential;
      resourceID?: string;
    };
    preferenceType?: UserPreferenceType;
  }): Promise<string[]> {
    const { credential, preferenceType } = options;
    const recipients =
      await this.alkemioAdapter.getUniqueUsersMatchingCredentialCriteria([
        credential,
      ]);

    if (!preferenceType) {
      return extractId(recipients);
    }

    const recipientsWithActivePreference = recipients.filter(r => {
      const targetPreference = r.preferences?.find(
        p => p.definition.type === preferenceType
      );

      if (!targetPreference) {
        return false;
      }
      // later to take into account the preference value type and test against the proper value
      return targetPreference?.value === 'true';
    });

    return extractId(recipientsWithActivePreference);
  }
}

const extractId = <T extends { id: string }>(data: T[]): string[] =>
  data.map(({ id }) => id);
