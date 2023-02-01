import { BaseEventPayload } from './base.event.payload';
export interface CommunicationOrganizationMessageEventPayload
    extends BaseEventPayload {
    message: string;
    organization: {
        id: string;
        displayName: string;
    };
}
