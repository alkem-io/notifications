import { RoleChangeType } from '@alkemio/notifications-lib';
import { BaseEmailPayload } from './base.email.payload';

export interface PlatformGlobalRoleChangeEmailPayload extends BaseEmailPayload {
  user: {
    displayName: string;
    firstName: string;
    email: string;
    profile: string;
  };
  actor: {
    displayName: string;
    url: string;
  };
  type: RoleChangeType;
  role: string;
  triggeredBy: string;
}
