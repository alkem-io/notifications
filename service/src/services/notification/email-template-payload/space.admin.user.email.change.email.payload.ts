import { BaseSpaceEmailPayload } from './base.space.email.payload';

// Email-template payload for the USER_EMAIL_CHANGE_SPACE_ADMIN_NOTIFICATION
// message sent to the admins and leads of a space. Space-scoped so the
// message names the space it concerns (FR-005/FR-006).
export interface SpaceAdminUserEmailChangeEmailPayload extends BaseSpaceEmailPayload {
  subjectName: string;
  initiatorName: string;
  isSelfInitiated: boolean;
  oldEmail: string;
  newEmail: string;
  changedAt: string;
}
