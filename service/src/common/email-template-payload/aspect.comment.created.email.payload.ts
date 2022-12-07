import { BaseEmailPayload } from '@common/email-template-payload/base.email.payload';
// @ts-
export interface AspectCommentCreatedEmailPayload extends BaseEmailPayload {
  aspect: {
    displayName: string;
  };
  recipient: {
    firstname: string;
    email: string;
    notificationPreferences: string;
  };
  createdBy: {
    firstname: string;
    email: string;
  };
  community: {
    name: string;
    url: string;
  };
}
