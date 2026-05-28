// Event USER_PASSWORD_CHANGE_SECURITY_SIGNAL — published raw (no
// BaseEventPayload envelope) by the server's password-change observer.
// Delivered to the user's CURRENT email address whenever a Kratos-side
// password change is observed. The credential itself never reaches this
// service — only the fact of the change and the observation timestamp.
export interface NotificationEventPayloadUserPasswordChangeSecuritySignal {
  recipientEmail: string;
  observedAtISO8601: string;
}
