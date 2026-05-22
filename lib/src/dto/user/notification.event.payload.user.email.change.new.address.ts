// Event USER_EMAIL_CHANGE_NEW_ADDRESS_NOTIFICATION — published raw (no
// BaseEventPayload envelope). Delivered to the NEW mailbox address, which the
// recipient owns, so the full new address is carried.
export interface NotificationEventPayloadUserEmailChangeNewAddress {
  recipientEmail: string;
  commitTimestampISO8601: string;
  initiatorRole: "self" | "platform_admin";
  newEmailFull: string;
  loginUrl: string;
}
