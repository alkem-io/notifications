import { BaseEventPayload } from './base.event.payload';
export interface CommunicationUserMessageEventPayload extends BaseEventPayload {
    message: string;
    messageReceiver: {
        id: string;
        displayName: string;
    };
}
