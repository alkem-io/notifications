import {
  CommunityNewMemberPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCategory,
  InAppNotificationCommunityNewMemberPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import {
  CommunityContributorType,
  UserPreferenceType,
} from '@alkemio/client-lib';
import { Injectable } from '@nestjs/common';
import { NotificationBuilder } from '../notification.builder';
import { InAppDispatcher } from '../../dispatchers';
import { BuilderUtil } from '@src/services/builders/utils/builder.util';
import { RoleConfig } from '../role.config';

@Injectable()
export class CommunityNewContributorInAppNotificationBuilder
  implements NotificationBuilder
{
  constructor(
    private readonly inAppDispatcher: InAppDispatcher,
    private readonly util: BuilderUtil
  ) {}
  public async buildAndSend(event: CommunityNewMemberPayload): Promise<void> {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: RoleConfig[] = [
      {
        category: InAppNotificationCategory.ADMIN,
        preferenceType: UserPreferenceType.NotificationCommunityNewMemberAdmin,
        credential: {
          type: AuthorizationCredential.SpaceAdmin,
          resourceID: event.space.id,
        },
      },
      {
        category: InAppNotificationCategory.MEMBER,
        preferenceType: UserPreferenceType.NotificationCommunityNewMember,
        credential: {
          type: AuthorizationCredential.UserSelfManagement,
          resourceID: event.contributor.id,
        },
      },
    ];
    const notifications = await this.util.genericBuild(
      roleConfig,
      event,
      newMemberBuilder
    );

    this.inAppDispatcher.dispatch(notifications);
  }
}

const newMemberBuilder = (
  category: InAppNotificationCategory,
  receiverIDs: string[],
  event: CommunityNewMemberPayload
): CompressedInAppNotificationPayload<InAppNotificationCommunityNewMemberPayload> => {
  const {
    space: { id: spaceID },
    triggeredBy: triggeredByID,
    contributor: { id: newMemberID, type: contributorType },
  } = event;

  return {
    type: NotificationEventType.COMMUNITY_NEW_MEMBER,
    triggeredAt: new Date(),
    receiverIDs,
    category,
    spaceID,
    triggeredByID,
    newMemberID,
    contributorType: contributorType as CommunityContributorType,
    receiverID: '',
  };
};
