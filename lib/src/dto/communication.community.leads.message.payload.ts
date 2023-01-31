import { JourneyBaseEventPayload } from "./journey.base.event.payload";

export interface CommunicationCommunityLeadsMessageEventPayload extends JourneyBaseEventPayload {
    message: string;
    messageSender: {
        id: string
    };
}
