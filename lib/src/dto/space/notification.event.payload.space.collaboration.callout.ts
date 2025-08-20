import { ContributorPayload } from "../contributor.payload";
import { NotificationEventPayloadSpace } from "./notification.event.payload.space";

export interface NotificationEventPayloadSpaceCollaborationCallout
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
    contribution?: {
      id: string;
      type: string;
      displayName: string;
      description: string;
      url: string;
    };
  };
  comment?: {
    message: string;
    createdBy: ContributorPayload;
  };
}
