import {
  CommunicationUserMentionEventPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCategory,
  InAppNotificationContributorMentionedPayload,
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
export class ContributorMentionedInAppNotificationBuilder
  implements NotificationBuilder
{
  constructor(
    private readonly inAppDispatcher: InAppDispatcher,
    private readonly util: InAppBuilderUtil,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
  ) {}
  public async buildAndSend(
    event: CommunicationUserMentionEventPayload
  ): Promise<void> {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: InAppReceiverConfig[] = [
      {
        category: InAppNotificationCategory.SELF,
        preferenceType: PreferenceType.NotificationCommunicationMention,
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

    try {
      this.inAppDispatcher.dispatch(notifications);
    } catch (e: any) {
      this.logger.error(
        `${ContributorMentionedInAppNotificationBuilder.name} failed to dispatch in-app notification`,
        e?.stack
      );
    }
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
    commentOrigin: {
      url: commentOrigin.url,
      displayName: commentOrigin.displayName,
    },
    contributorType: contributorType as CommunityContributorType,
    receiverID: '',
  };
};
