import {
  CollaborationCalloutPublishedEventPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCalloutPublishedPayload,
  InAppNotificationCategory,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import { UserPreferenceType } from '@alkemio/client-lib';
import { Injectable } from '@nestjs/common';
import { NotificationBuilder } from '../notification.builder';
import { InAppDispatcher } from '../../dispatchers';
import { BuilderUtil } from '@src/services/builders/utils/builder.util';
import { RoleConfig } from '../role.config';

@Injectable()
export class CalloutPublishedInAppNotificationBuilder
  implements NotificationBuilder
{
  constructor(
    private readonly inAppDispatcher: InAppDispatcher,
    private readonly util: BuilderUtil
  ) {}
  public async buildAndSend(
    event: CollaborationCalloutPublishedEventPayload
  ): Promise<void> {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: RoleConfig[] = [
      {
        category: InAppNotificationCategory.MEMBER,
        credential: {
          type: AuthorizationCredential.SpaceMember,
          resourceID: event.space.id,
        },
        preferenceType: UserPreferenceType.NotificationCalloutPublished,
      },
    ];
    const notifications = await this.util.genericBuild(
      roleConfig,
      event,
      calloutPublishedBuilder
    );

    this.inAppDispatcher.dispatch(notifications);
  }
}

const calloutPublishedBuilder = (
  category: InAppNotificationCategory,
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
    triggeredAt: new Date(),
    receiverIDs,
    category,
    calloutID,
    spaceID,
    triggeredByID,
    receiverID: '',
  };
};
