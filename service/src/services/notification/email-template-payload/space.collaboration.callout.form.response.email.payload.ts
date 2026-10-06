import { BaseSpaceEmailPayload } from './base.space.email.payload';

/**
 * Email payload for both Form response events. Link-only: it carries names,
 * URLs and the who-can-read sentence, never any answer or question text.
 */
export interface CollaborationCalloutFormResponseEmailPayload extends BaseSpaceEmailPayload {
  callout: {
    displayName: string;
    url: string;
  };
  submitter: {
    displayName: string;
  };
  formResponse: {
    submittedAt: string;
    visibility: 'ADMINS' | 'MEMBERS';
  };
  whoCanRead: string;
}
