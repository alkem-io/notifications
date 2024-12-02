import { Inject, Injectable } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER } from '@common/enums';
import { AlkemioClientAdapter } from '@src/services';
import {
  CompressedInAppNotificationPayload,
  InAppNotificationPayloadBase,
} from '@alkemio/notifications-lib';
import {
  AuthorizationCredential,
  UserPreferenceType,
} from '@alkemio/client-lib';
import { RoleConfig } from '../role.config';
import { PayloadBuilderFn } from './payload.builder.fn';

@Injectable()
export class BuilderUtil {
  constructor(
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter
  ) {}

  public async genericBuild<
    TEvent,
    TPayload extends InAppNotificationPayloadBase
  >(
    config: RoleConfig[],
    event: TEvent,
    payloadBuilder: PayloadBuilderFn<TEvent, TPayload>
  ): Promise<CompressedInAppNotificationPayload<TPayload>[]> {
    const receiversByCategory: Record<string, string[]> = {};
    for (const { category, credential, preferenceType } of config) {
      receiversByCategory[category] = await this.getReceivers({
        credential,
        preferenceType,
      });
    }
    // build notifications per roleConfig entry
    return config.map(({ category }) =>
      payloadBuilder(category, receiversByCategory[category], event)
    );
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
