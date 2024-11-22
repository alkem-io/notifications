import {
  CollaborationCalloutPublishedEventPayload,
  CompressedInAppNotificationPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import { Inject, Injectable } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER } from '@common/enums';
import { AlkemioClientAdapter } from '@src/services';

type InAppCategory = string;
type RoleConfig = {
  category: InAppCategory;
  credential: {
    type: AuthorizationCredential;
    resourceID: string;
  };
  preferenceType?: UserPreferenceType;
};

@Injectable()
export class InAppNotificationBuilder {
  constructor(
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter
  ) {}

  public async buildCalloutPublished(
    event: CollaborationCalloutPublishedEventPayload
  ): Promise<CompressedInAppNotificationPayload[]> {
    // we need to know:
    // what is the trigger
    // who are the receivers - roles (defined by credentials)
    // what is the preference to filter the receivers by (preference per category?)
    // what is the content
    // ----------
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: RoleConfig[] = [
      {
        category: 'member',
        credential: {
          type: AuthorizationCredential.SpaceMember,
          resourceID: event.space.id,
        },
        preferenceType: UserPreferenceType.NotificationCalloutPublished,
      },
    ];
    // get recipients per roleConfig entry - <category, receivers>
    const receiversByCategory: Record<string, string[]> = {};
    for (const { category, credential, preferenceType } of roleConfig) {
      receiversByCategory[category] = await this.getReceivers({
        credential,
        preferenceType,
      });
    }
    // build notifications per roleConfig entry
    return roleConfig.map(({ category }) =>
      this.build({
        category,
        receiverIDs: receiversByCategory[category],
        event,
      })
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
      resourceID: string;
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
      const userPreference = r.preferences?.find(
        p => p.definition.type === preferenceType
      );

      if (!userPreference) {
        return false;
      }
      // later to take into account the preference value type and test against the proper value
      return userPreference.value === 'true';
    });

    return extractId(recipientsWithActivePreference);
  }

  private build(options: {
    category: InAppCategory;
    receiverIDs: string[];
    event: CollaborationCalloutPublishedEventPayload;
  }): CompressedInAppNotificationPayload {
    const { category, receiverIDs, event } = options;
    const {
      callout: { id: calloutID },
      space: { id: spaceID },
      triggeredBy: triggeredByID,
    } = event;

    return {
      type: NotificationEventType.COLLABORATION_CALLOUT_PUBLISHED,
      triggeredAt: new Date(), //todo is this utc?
      receiverIDs,
      category,
      calloutID,
      spaceID,
      triggeredByID,
      receiverID: '', // can't remove it from the type
    };
  }
}

const extractId = <T extends { id: string }>(data: T[]): string[] =>
  data.map(({ id }) => id);
