import {
  CommunityNewMemberPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCategory,
  InAppNotificationCommunityNewMemberPayload,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import { CommunityContributorType, PreferenceType } from '@alkemio/client-lib';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { NotificationBuilder } from '../notification.builder';
import { InAppDispatcher } from '../../dispatchers';
import { InAppBuilderUtil } from '../utils';
import { InAppReceiverConfig } from '../in.app.receiver.config';

@Injectable()
export class CommunityNewContributorInAppNotificationBuilder
  implements NotificationBuilder
{
  constructor(
    private readonly inAppDispatcher: InAppDispatcher,
    private readonly util: InAppBuilderUtil,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
  ) {}
  public async buildAndSend(event: CommunityNewMemberPayload): Promise<void> {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: InAppReceiverConfig[] = [
      {
        category: InAppNotificationCategory.ADMIN,
        preferenceType: PreferenceType.NotificationCommunityNewMemberAdmin,
        credential: {
          type: AuthorizationCredential.SpaceAdmin,
          resourceID: event.space.id,
        },
      },
      {
        category: InAppNotificationCategory.MEMBER,
        preferenceType: PreferenceType.NotificationCommunityNewMember,
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

    try {
      this.inAppDispatcher.dispatch(notifications);
    } catch (e: any) {
      this.logger.error(
        `${CommunityNewContributorInAppNotificationBuilder.name} failed to dispatch in-app notification`,
        e?.stack
      );
    }
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
