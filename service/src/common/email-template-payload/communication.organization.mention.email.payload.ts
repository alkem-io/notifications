import { BaseEmailPayload } from './base.email.payload';

export interface CommunicationOrganizationMentionEmailPayload
  extends BaseEmailPayload {
  commentSender: {
    displayName: string;
  };
  comment: string;
  mentionedOrganization: {
    displayName: string;
  };
  commentOrigin: {
    url: string;
    displayName: string;
  };
}
