import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface NotificationEventPayloadSpaceCollaborationCalloutReaction
  extends NotificationEventPayloadSpace {
  callout: {
    id: string;
    framing: {
      id: string;
      type: string;
      displayName: string;
      description: string;
      url: string;
    };
  };
  reaction: {
    emoji: string;
  };
}
