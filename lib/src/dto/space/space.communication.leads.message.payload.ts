import { SpaceBaseEventPayload } from "./space.base.event.payload";

export interface SpaceCommunicationLeadsMessageEventPayload
    extends SpaceBaseEventPayload {
    message: string;
}
