import { BaseEventPayload } from './base.event.payload';

export interface PlatformForumDiscussionCreatedEventPayload
  extends BaseEventPayload {
  discussion: {
    id: string;
    createdBy: string;
    displayName: string;
    url: string;
  };
}
