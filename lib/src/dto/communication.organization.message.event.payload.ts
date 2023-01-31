import { BaseEventPayload } from "./base.event.payload";
export interface CommunicationOrganizationMessageEventPayload extends BaseEventPayload {
    message: string;
    messageSender: {
        id: string
    };
    organization: {
        id: string
        displayName: string
    }
}
