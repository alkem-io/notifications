import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCommunityCalendarEventCreatedEmailPayload
  extends BaseSpaceEmailPayload {
  creator: {
    name: string;
    profile: string;
  };
  calendarEvent: {
    title: string;
    type: string;
    url: string;
  };
}
