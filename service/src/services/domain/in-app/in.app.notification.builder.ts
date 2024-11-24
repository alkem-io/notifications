import {
  CollaborationCalloutPublishedEventPayload,
  CommunicationUserMentionEventPayload,
  CommunityNewMemberPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCalloutPublishedPayload,
  InAppNotificationCommunityNewMemberPayload,
  InAppNotificationContributorMentionedPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import {
  CommunityContributorType,
  UserPreferenceType,
} from '@alkemio/client-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import { Inject, Injectable } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER } from '@common/enums';
import { AlkemioClientAdapter } from '@src/services';
import { InAppNotificationPayloadBase } from '@alkemio/notifications-lib/dist/dto/in-app/in.app.notification.payload.base';
import { EmailTemplate } from '@common/enums/email.template';

type InAppCategory = string;
type RoleConfig = {
  category: InAppCategory;
  credential: {
    type: AuthorizationCredential;
    resourceID: string;
  };
  preferenceType?: UserPreferenceType;
};

type BuilderFn<TEvent, TPayload extends InAppNotificationPayloadBase> = (
  category: string,
  receiverIDs: string[],
  event: TEvent
) => CompressedInAppNotificationPayload<TPayload>;

// we need to know:
// what is the trigger
// who are the receivers - roles (defined by credentials)
// what is the preference to filter the receivers by (preference per category?)
// what is the content
@Injectable()
export class InAppNotificationBuilder {
  constructor(
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter
  ) {}

  public async buildCalloutPublished(
    event: CollaborationCalloutPublishedEventPayload
  ): Promise<
    CompressedInAppNotificationPayload<InAppNotificationCalloutPublishedPayload>[]
  > {
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
    return this.genericBuild(roleConfig, event, calloutPublishedBuilder);
  }

  public async buildNewMember(
    event: CommunityNewMemberPayload
  ): Promise<
    CompressedInAppNotificationPayload<InAppNotificationCommunityNewMemberPayload>[]
  > {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: RoleConfig[] = [
      {
        category: 'admin',
        preferenceType: UserPreferenceType.NotificationCommunityNewMemberAdmin,
        credential: {
          type: AuthorizationCredential.SpaceAdmin,
          resourceID: event.space.id,
        },
      },
      {
        category: 'member',
        preferenceType: UserPreferenceType.NotificationCommunityNewMember,
        credential: {
          type: AuthorizationCredential.UserSelfManagement,
          resourceID: event.contributor.id,
        },
      },
    ];
    return this.genericBuild(roleConfig, event, newMemberBuilder);
  }

  public async buildContributorMention(
    event: CommunicationUserMentionEventPayload
  ): Promise<
    CompressedInAppNotificationPayload<InAppNotificationContributorMentionedPayload>[]
  > {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: RoleConfig[] = [
      {
        category: 'self',
        preferenceType: UserPreferenceType.NotificationCommunicationMention,
        credential: {
          type: AuthorizationCredential.UserSelfManagement,
          resourceID: event.mentionedUser.id,
        },
      },
    ];
    return this.genericBuild(roleConfig, event, contributorMentionBuilder);
  }

  /**
   * Generic method to build in-app notifications.
   * Uses each entry in the config to gather receivers for that category.
   * Then builds the notification payload using the provided builder function.
   *
   * @template TEvent - The type of the event.
   * @template TPayload - The type of the payload, extending InAppNotificationPayloadBase.
   *
   * @param {RoleConfig[]} config - The configuration for roles, including category, credential, and preference type.
   * @param {TEvent} event - The event data used to build the notification payload.
   * @param {BuilderFn<TEvent, TPayload>} builder - The builder function to create the notification payload.
   *
   * @returns {Promise<CompressedInAppNotificationPayload<TPayload>[]>} - A promise that resolves to an array of compressed in-app notification payloads.
   */
  private async genericBuild<
    TEvent,
    TPayload extends InAppNotificationPayloadBase
  >(
    config: RoleConfig[],
    event: TEvent,
    builder: BuilderFn<TEvent, TPayload>
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
      builder(category, receiversByCategory[category], event)
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
      return userPreference?.value === 'true';
    });

    return extractId(recipientsWithActivePreference);
  }
}

const extractId = <T extends { id: string }>(data: T[]): string[] =>
  data.map(({ id }) => id);

const calloutPublishedBuilder = (
  category: InAppCategory,
  receiverIDs: string[],
  event: CollaborationCalloutPublishedEventPayload
): CompressedInAppNotificationPayload<InAppNotificationCalloutPublishedPayload> => {
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
    receiverID: '',
  };
};

const newMemberBuilder = (
  category: InAppCategory,
  receiverIDs: string[],
  event: CommunityNewMemberPayload
): CompressedInAppNotificationPayload<InAppNotificationCommunityNewMemberPayload> => {
  const {
    space: { id: spaceID },
    triggeredBy: triggeredByID,
    contributor: { id: newMemberID },
  } = event;

  return {
    type: NotificationEventType.COMMUNITY_NEW_MEMBER,
    triggeredAt: new Date(), //todo is this utc?
    receiverIDs,
    category,
    spaceID,
    triggeredByID,
    newMemberID,
    receiverID: '',
  };
};

const contributorMentionBuilder = (
  category: InAppCategory,
  receiverIDs: string[],
  event: CommunicationUserMentionEventPayload
): CompressedInAppNotificationPayload<InAppNotificationContributorMentionedPayload> => {
  const {
    triggeredBy: triggeredByID,
    comment,
    commentOrigin,
    mentionedUser: { type: contributorType },
  } = event;

  return {
    type: NotificationEventType.COMMUNICATION_USER_MENTION,
    triggeredAt: new Date(), //todo is this utc?
    receiverIDs,
    category,
    triggeredByID,
    comment,
    commentOrigin: { url: commentOrigin.url, type: '' },
    contributorType: contributorType as CommunityContributorType,
    receiverID: '',
  };
};
