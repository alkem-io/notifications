import { BaseEventPayload } from "./base.event.payload";
export interface CommunicationUserMessageEventPayload extends BaseEventPayload {
    message: string;
    messageSender: {
        id: string
    };
    messageReceiver: {
        id: string;
        displayName: string
    }
}
