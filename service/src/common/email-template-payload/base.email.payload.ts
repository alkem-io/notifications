export interface BaseEmailPayload {
  platform: {
    url: string; // the url of alkemio
    invitationsURL?: string; // the invitations url
  };
  recipient: {
    firstName: string;
    email: string;
    notificationPreferences: string;
  };
}
