import { ContributorPayload } from "./contributor.payload";

export interface BaseEventPayload {
    eventType: string;
    triggeredBy: ContributorPayload;
    recipients: ContributorPayload[];
    platform: {
        url: string;
    }
} 
