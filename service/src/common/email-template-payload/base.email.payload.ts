export interface BaseEmailPayload {
  emailFrom: string;
  platform: {
    url: string; // the url of alkemio
  };
  recipient: {
    firstName: string;
    email: string;
    notificationPreferences: string;
  };
}
