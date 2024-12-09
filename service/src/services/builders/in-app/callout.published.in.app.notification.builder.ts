import {
  CollaborationCalloutPublishedEventPayload,
  CompressedInAppNotificationPayload,
  InAppNotificationCalloutPublishedPayload,
  InAppNotificationCategory,
  NotificationEventType,
} from '@alkemio/notifications-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import { UserPreferenceType } from '@alkemio/client-lib';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationBuilder } from '../notification.builder';
import { InAppDispatcher } from '../../dispatchers';
import { InAppBuilderUtil } from '../utils';
import { InAppReceiverConfig } from '../in.app.receiver.config';

@Injectable()
export class CalloutPublishedInAppNotificationBuilder
  implements NotificationBuilder
{
  constructor(
    private readonly inAppDispatcher: InAppDispatcher,
    private readonly util: InAppBuilderUtil,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
  ) {}
  public async buildAndSend(
    event: CollaborationCalloutPublishedEventPayload
  ): Promise<void> {
    // the config can be defined per notification type in a centralized place
    // and retrieved using the config service
    const roleConfig: InAppReceiverConfig[] = [
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

    try {
      this.inAppDispatcher.dispatch(notifications);
    } catch (e: any) {
      this.logger.error(
        `${CalloutPublishedInAppNotificationBuilder.name} failed to dispatch in-app notification`,
        e?.stack
      );
    }
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
