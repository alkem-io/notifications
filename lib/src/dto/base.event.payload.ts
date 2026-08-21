import { UserPayload } from './user.payload';

export interface BaseEventPayload {
  eventType: string;
  triggeredBy: UserPayload;
  recipients: UserPayload[];
  platform: {
    url: string;
  };
}
