import { BaseEventPayload } from "../base.event.payload";
import { SpacePayload } from "./space.payload";

export interface NotificationEventPayloadSpace
  extends BaseEventPayload {
  space: SpacePayload;
  calendarEvent?: {
    id: string;
    title: string;
    type: string;
    createdBy: string;
    url: string;
  };
}
