import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCommunityCalendarEventCommentEmailPayload
  extends BaseSpaceEmailPayload {
  calendarEvent: {
    title: string;
    type: string;
    url: string;
  };
  commentor: {
    name: string;
    profile: string;
  };
}
