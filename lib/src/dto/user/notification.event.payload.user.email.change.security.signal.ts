// Event USER_EMAIL_CHANGE_SECURITY_SIGNAL — published raw (no BaseEventPayload
// envelope). Delivered to the OLD mailbox address. The full new address is
// never carried; only the masked form.
export interface NotificationEventPayloadUserEmailChangeSecuritySignal {
  recipientEmail: string;
  commitTimestampISO8601: string;
  initiatorRole: "self" | "platform_admin";
  newEmailMasked: string;
}
