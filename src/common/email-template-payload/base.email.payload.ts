export interface BaseEmailPayload {
  emailFrom: string;
  hub: {
    url: string; // the url of alkemio
  };
  recipient: {
    notificationPreferences: string;
  };
}
