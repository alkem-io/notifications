import { UserPayload } from '../user.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface NotificationEventPayloadSpaceCalendarEvent
  extends NotificationEventPayloadSpace {
  calendarEvent: {
    id: string;
    title: string;
    type: string;
    createdBy: UserPayload;
    url: string;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    wholeDay: boolean;
    description?: string;
    location?: string;
    googleCalendarUrl: string;
    outlookCalendarUrl: string;
    icsDownloadUrl: string;
  };
}
