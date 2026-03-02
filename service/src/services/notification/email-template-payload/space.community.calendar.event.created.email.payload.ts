import { BaseSpaceEmailPayload } from './base.space.email.payload';

export interface SpaceCommunityCalendarEventCreatedEmailPayload
  extends BaseSpaceEmailPayload {
  creator: {
    name: string;
    profile: string;
  };
  calendarEvent: {
    title: string;
    description: string | undefined;
    type: string;
    url: string;
    location: string | undefined;
    startDate: string; // ISO 8601 format, e.g. '2021-01-24T15:30:00.000Z'
    endDate: string; // ISO 8601 format
    wholeDay: boolean;
    formattedStartDate: string;
    formattedEndDate: string | null;
    appleCalendarUrl: string;
    outlookCalendarUrl: string;
    googleCalendarUrl: string;
    icsDownloadUrl: string;
  };
}
