import { User } from "@alkemio/client-lib";
import { ContributorPayload } from "./contributor.payload";
import { UserPayload } from "./user.payload";

export interface BaseEventPayload {
    eventType: string;
    triggeredBy: UserPayload;
    recipients: UserPayload[];
    platform: {
        url: string;
    }
} 
