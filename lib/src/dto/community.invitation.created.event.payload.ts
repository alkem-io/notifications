import { SpaceBaseEventPayload } from './space.base.event.payload';

export interface CommunityInvitationCreatedEventPayload
  extends SpaceBaseEventPayload {
  invitee: {
    id: string;
    url: string;
    displayName: string;
  }
}
