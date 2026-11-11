/**
 * Locally-declared wire payload for USER_SECOND_FACTOR_CHANGE_SECURITY_SIGNAL.
 * `@alkemio/notifications-lib` stays pinned at its published version — this
 * interface is declared with the same two fields on each side (the server's
 * copy sits beside its observer), so a field-identity check is the contract,
 * and publishing the lib later is a pure type-only swap.
 *
 * Published raw, like the password-change signal: no BaseEventPayload
 * envelope; `normalizeRawRecipientEmailEvent` adds it.
 */
export interface NotificationEventPayloadUserSecondFactorChangeSecuritySignal {
  recipientEmail: string;
  observedAtISO8601: string;
}
