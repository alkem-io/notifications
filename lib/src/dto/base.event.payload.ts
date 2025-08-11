import { ContributorPayload } from "./contributor.payload";
import { UserPayload } from "./user.payload";

export interface BaseEventPayload {
    eventType: string;
    triggeredBy: ContributorPayload;
    recipients: UserPayload[];
    platform: {
        url: string;
    }
} 
