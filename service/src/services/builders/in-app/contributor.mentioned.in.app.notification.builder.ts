import {
  CommunicationUserMentionEventPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCategory,
  InAppNotificationContributorMentionedPayload,
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
import { InAppBuilderUtil } from '../utils';
import { InAppReceiverConfig } from '../in.app.receiver.config';

@Injectable()
export class ContributorMentionedInAppNotificationBuilder
  implements NotificationBuilder
{
  constructor(
    private readonly inAppDispatcher: InAppDispatcher,
    private readonly util: InAppBuilderUtil
  ) {}
  public async buildAndSend(
    event: CommunicationUserMentionEventPayload
  ): Promise<void> {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: InAppReceiverConfig[] = [
      {
        category: InAppNotificationCategory.SELF,
        preferenceType: UserPreferenceType.NotificationCommunicationMention,
        credential: {
          type: AuthorizationCredential.UserSelfManagement,
          resourceID: event.mentionedUser.id,
        },
      },
    ];
    const notifications = await this.util.genericBuild(
      roleConfig,
      event,
      contributorMentionBuilder
    );

    this.inAppDispatcher.dispatch(notifications);
  }
}

const contributorMentionBuilder = (
  category: InAppNotificationCategory,
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
    triggeredAt: new Date(),
    receiverIDs,
    category,
    triggeredByID,
    comment,
    commentOrigin: { url: commentOrigin.url, type: '' },
    contributorType: contributorType as CommunityContributorType,
    receiverID: '',
  };
};
