import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * "Someone responded to the invitation you sent" for a *user* invitee —
 * accepted or declined. Sent to the Space admin who created the invitation.
 * The invitee answers their own invitation, so `invitee` is both the
 * subject of the sentence and the actor.
 */
export interface UserSpaceCommunityInvitationOutcomeEmailPayload extends BaseSpaceEmailPayload {
  invitee: {
    name: string;
    profile: string;
  };
  spaceCommunitySettingsURL: string;
}
