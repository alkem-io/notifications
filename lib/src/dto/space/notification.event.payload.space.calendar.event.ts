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
  };
}
