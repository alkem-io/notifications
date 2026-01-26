# Research: Remove Registration Successful Notification

**Date**: 2026-01-26
**Feature**: 003-remove-registration-notification

## Overview

This document captures research findings for removing the registration notification from the Alkemio notifications service.

## Research Tasks

### 1. Current Notification Flow Analysis

**Question**: How does the current registration notification flow work?

**Findings**:
- Two notification events exist: `USER_SIGN_UP_WELCOME` (to new user) and `PLATFORM_ADMIN_USER_PROFILE_CREATED` (to admins)
- Events are received via RabbitMQ queue `alkemio-notifications`
- Processing flow: Event → `NotificationService.processNotificationEvent()` → payload builder → template rendering → email send
- Both events use `NotificationEventPayloadPlatformUserRegistration` as input
- Both produce `PlatformUserRegisteredEmailPayload` for template rendering

**Decision**: Remove both event handlers - they serve the same purpose (registration notification)

### 2. Event Handler Behavior for Unknown Events

**Question**: How should the system handle stray registration events during deployment transition?

**Findings**:
- Current behavior: `default` case in both switch statements throws `EventPayloadNotProvidedException`
- This causes message to be rejected and requeued (see lines 100, 117 in notification.service.ts)
- Spec requirement: "fail silently (no error, no action)"

**Decision**: Modify `default` case to log a warning and return a no-op payload, rather than throwing. This allows the message to be acknowledged without sending any notification.

**Alternatives Considered**:
1. Keep throwing exception - Rejected: causes message requeue loops
2. Add explicit `case` for the events that returns early - Rejected: unnecessarily keeps event awareness in code
3. Log warning and return no-op in default - **Selected**: clean, forward-compatible

### 3. Library DTO Retention

**Question**: Should `NotificationEventPayloadPlatformUserRegistration` be removed from the lib package?

**Findings**:
- The `@alkemio/notifications-lib` package is published to npm
- Other repositories (alkem-io/server) may import this type
- Removing it would be a breaking change requiring coordinated releases
- The type costs nothing to keep (no runtime impact)

**Decision**: Keep the DTO in lib/ - removal requires cross-repository coordination and provides no benefit

**Rationale**: The lib package follows semver; removing a type is a breaking change (major version bump). The server repository sends these events and may still reference the type. Keeping it ensures backward compatibility.

### 4. Email Payload Type Retention

**Question**: Should `PlatformUserRegisteredEmailPayload` be removed from the service?

**Findings**:
- Located at `service/src/services/notification/email-template-payload/platform.user.registered.email.payload.ts`
- Only used by the two builder methods being removed
- Exported via barrel file `index.ts`
- Not imported by other services

**Decision**: Remove the email payload type - it's internal to the service and has no external consumers

### 5. Admin Notification Consideration

**Question**: Should the admin notification (`PLATFORM_ADMIN_USER_PROFILE_CREATED`) be preserved?

**Findings**:
- This notification alerts platform admins when new users register
- Per spec: "Only registration notification - all other notifications remain unchanged"
- The spec explicitly targets the registration flow, which includes both user welcome and admin notification
- Admin notification is part of the same "registration notification" feature

**Decision**: Keep the admin notification (`PLATFORM_ADMIN_USER_PROFILE_CREATED`). Only the user welcome notification (`USER_SIGN_UP_WELCOME`) is removed. The admin notification serves a separate purpose (admin monitoring of new registrations) and should continue to function.

**Clarification**: "Only registration notification" refers specifically to the user-facing welcome email, not the admin monitoring notification.

### 6. Graceful Degradation During Transition

**Question**: How to ensure zero downtime during the transition period?

**Findings**:
- Deployment order: notifications service first, then Kratos templates
- During transition: users won't receive welcome content (accepted per spec)
- Server may still send registration events for a brief period
- Need to handle these gracefully

**Decision**: Implement graceful handling in `default` case:
```typescript
default:
  this.logger.warn(
    `[${eventPayload.eventType}] Unrecognized event type, skipping notification`,
    LogContext.NOTIFICATIONS
  );
  return this.createNoOpPayload(eventPayload, recipient);
```

Where `createNoOpPayload` returns a minimal BaseEmailPayload that results in no email being sent (by returning before the send step, or using a mechanism that the sender recognizes as "skip").

**Alternative approach**: Simply remove the cases and let the default throw. The message will be nacked and moved to dead-letter queue. This is acceptable if:
1. Dead-letter queue is properly configured
2. Operations team is aware of expected transient failures

**Recommended**: Log warning, acknowledge message, send no email. This is cleaner than DLQ pollution.

## Summary of Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Event handler removal | Remove only `UserSignUpWelcome` case; keep `PlatformAdminUserProfileCreated` | Admin notification serves separate purpose (admin monitoring) |
| Unknown event handling | Log warning, acknowledge message, no email | Graceful degradation during transition |
| Lib DTO | Keep `NotificationEventPayloadPlatformUserRegistration` | Avoid breaking change to npm consumers |
| Service email payload | Remove `PlatformUserRegisteredEmailPayload` | Internal only, no external consumers |
| Template files | Delete only `user.sign.up.welcome.js`; keep `platform.admin.user.profile.created.js` | Admin template still needed |
| Builder methods | Remove only `createEmailTemplatePayloadUserSignUpWelcome`; keep admin builder | Admin builder still needed |

## Implementation Notes

1. **Order of changes**:
   - First: Add graceful handling for unknown events (safety net)
   - Second: Remove case statements from switch
   - Third: Remove builder methods
   - Fourth: Delete template files
   - Fifth: Clean up unused imports and types

2. **Testing strategy**:
   - No existing unit tests for these notifications
   - Manual test: publish registration event to RabbitMQ, verify no email sent and no error
   - Verify other notifications still work (regression test)

3. **Rollback plan**:
   - Git revert of the commit
   - No database migrations to reverse
   - No external dependencies to coordinate
