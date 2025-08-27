import { ContributorPayload } from '../contributor.payload';
import { NotificationEventPayloadSpace } from './notification.event.payload.space';

export interface NotificationEventPayloadSpaceCommunicationUpdate extends NotificationEventPayloadSpace {
  update: {
    id: string;
    createdBy: ContributorPayload;
    url: string;
  };
  message?: string;
}
