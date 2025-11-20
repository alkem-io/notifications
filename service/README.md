# notifications

Alkemio out-of-band notifications service.

[![Build Status](https://app.travis-ci.com/alkem-io/notifications.svg?branch=develop)](https://app.travis-ci.com/alkem-io/notifications.svg?branch=develop)
[![Coverage Status](https://coveralls.io/repos/github/alkem-io/notifications/badge.svg?branch=develop)](https://coveralls.io/github/alkem-io/notifications?branch=develop)
[![BCH compliance](https://bettercodehub.com/edge/badge/alkem-io/notifications?branch=develop)](https://bettercodehub.com/)
[![Deploy to DockerHub](https://github.com/alkem-io/notifications/actions/workflows/build-release-docker-hub.yml/badge.svg)](https://github.com/alkem-io/notifications/actions/workflows/build-release-docker-hub.yml)

## To test

1. Start quickstart-services from the server repo with defaults.
2. Start mailslurper:

```
npm run start:services
```

3. Go to http://localhost:15672/#/queues/%2F/alkemio-notifications.
4. Under publish message, go to `properties` and add a new property with name `content_type` and value `application/json`.
5. Select payload:

```json
{
  "data": "YOUR_DATA"
}
```

6. Click publish.
7. Navigate to http://localhost:5051/mailcount. You will see mailCount > 0 (mailslurper will reset the count on each restart).
8. Navigate to http://localhost:5051/mail. Search for YOUR_DATA. You will find it in the mail message.

## Adding New Notifications

The notification architecture has been significantly simplified. Adding a new notification now requires fewer steps and no individual builder classes.

### 1. Define the Event Payload Interface (lib)

Create a new notification event payload in the appropriate domain directory.

**Reference**: `lib/src/dto/space/notification.event.payload.space.communication.message.direct.ts`

- Extend the relevant base payload (e.g., `NotificationEventPayloadSpace`)
- Define event-specific properties (triggeredBy, message, etc.)
- Export it in the respective index file (`lib/src/dto/space/index.ts`)

### 2. Create the Email Template Payload Interface (service)

Define the email template payload interface.

**Reference**: `service/src/services/notification/email-template-payload/space.communication.message.direct.email.payload.ts`

- Extend `BaseSpaceEmailPayload` (or `BaseEmailPayload` for non-space notifications)
- Define email-specific data structure (messageSender, message, etc.)
- Export it in the email template payload index file

### 3. Add Method to Email Payload Builder Service

Add a new method to the consolidated builder service.

**Reference**: `service/src/services/notification/notification.email.payload.builder.service.ts`

- Create a method that transforms event payload to email template payload
- Follow naming convention: `createEmailTemplatePayload[NotificationType]`
- Use helper methods like `createSpaceBaseEmailPayload()` when applicable

### 4. Create the Email Template

Create the email template file using Nunjucks templating.

**Reference**: `service/src/email-templates/space.lead.communication.message.direct.receiver.js`

- Use `module.exports = () => ({ ... })` format
- Include name, title, version, and channels
- Define email properties: to, replyTo, subject, html
- Use template variables from email payload (e.g., `{{messageSender.displayName}}`)
- Extend the base layout: `{% extends "src/email-templates/_layouts/email-transactional.html" %}`
- Include footer block: `${templates.footerBlock}`

### 5. Add Event Case to Notification Service

Add cases to both switch statements in the notification service.

**Reference**: `service/src/services/notification/notification.service.ts`

- In `createEmailPayloadForEvent()`: Add new case for your `NotificationEvent` enum value to call the corresponding method from `notificationEmailPayloadBuilderService`
- In `getEmailTemplateToUseForEvent()`: Add new case to map your event to the email template filename
- Cast the eventPayload to your specific payload type

**Note**: Template mapping is now handled directly in the `getEmailTemplateToUseForEvent` method rather than through a separate enum.

### Simplified Architecture Benefits

- **No individual builder classes** - All logic consolidated in one service
- **No dependency injection complexity** - Single service handles all transformations
- **No app.module registration** - Builder service is automatically available
- **Centralized template mapping** - Email template mapping handled directly in service method
- **Fewer files to maintain** - Consolidated approach reduces code duplication

## Additional Information

### Email Blacklist Feature

The notifications service supports both static and dynamic (GraphQL-sourced) email blacklists to prevent notifications from being sent to specific email addresses. This is useful for blocking test accounts, legal hold addresses, or other emails that should never receive notifications.

#### GraphQL Blacklist (Default)

By default, the service fetches the blacklist dynamically from the Alkemio GraphQL API. The blacklist is sourced from `platform.settings.integration.notificationEmailBlacklist` and is synchronized periodically.

**Configuration**:

```bash
# Enable/disable GraphQL blacklist sync (default: true)
ALKEMIO_BLACKLIST_SYNC_ENABLED=true

# Refresh interval in milliseconds (default: 300000 = 5 minutes)
ALKEMIO_BLACKLIST_SYNC_INTERVAL_MS=300000

# Initial backoff for retries in milliseconds (default: 250)
ALKEMIO_BLACKLIST_SYNC_INITIAL_BACKOFF_MS=250

# Maximum backoff for retries in milliseconds (default: 30000 = 30 seconds)
ALKEMIO_BLACKLIST_SYNC_MAX_BACKOFF_MS=30000
```

**Behavior**:

- **Automatic updates**: Changes made via GraphQL mutations (`addNotificationEmailToBlacklist`/`removeNotificationEmailFromBlacklist`) propagate within the configured sync interval (default 5 minutes)
- **No restart required**: Blacklist updates are applied automatically during the next sync
- **Fail-open on startup**: If GraphQL is unavailable at startup, the service starts with an empty blacklist and logs errors
- **Last-good snapshot retention**: On refresh failures, the service keeps using the most recent successful snapshot
- **Exponential backoff**: Failed sync attempts use exponential backoff to avoid overwhelming the API

**Logging**:

Sync operations emit structured logs:

```json
{
  "event": "blacklist_sync_success",
  "snapshot_size": 5,
  "fetched_at": "2025-11-19T16:30:00.000Z",
  "platform_id": "platform-uuid"
}
```

For more details, see `specs/002-graphql-blacklist/quickstart.md`.

#### Static Blacklist (Fallback)

For environments without GraphQL access, disable GraphQL sync and use static configuration:

```bash
# Disable GraphQL sync
ALKEMIO_BLACKLIST_SYNC_ENABLED=false

# Configure static blacklist (comma-separated)
NOTIFICATIONS_EMAIL_BLACKLIST="test1@test.com,test2@test.com,blocked@example.org"
```

**Behavior**:

- **Exact matching only**: Email addresses must match exactly (case-insensitive)
- **Applied globally**: Blacklist applies to all notification types
- **Fail-safe**: Invalid email formats are logged as warnings and ignored
- **Automatic deduplication**: Duplicate entries are handled automatically
- **Restart required**: Changes to the static blacklist require a service restart

#### Blacklist Filtering Logs

When a recipient is filtered by the blacklist, structured log entries are emitted:

```json
{
  "event": "notification_blacklist_block",
  "recipient_email": "blocked@example.org",
  "reason": "blacklisted",
  "user_id": "user-123",
  "blacklist_source": "graphql",
  "snapshot_fetched_at": "2025-11-19T16:30:00.000Z"
}
```

After the latest architectural simplification, the notification system has been streamlined significantly:

### Current Architecture:

The notification service now follows a simplified pattern:

1. **Event Payloads** (`lib/src/dto/`): Define incoming notification event data structure
2. **Email Template Payloads** (`service/src/services/notification/email-template-payload/`): Define email template data structure
3. **Consolidated Builder Service** (`service/src/services/notification/notification.email.payload.builder.service.ts`): Single service that transforms all event payloads to email payloads
4. **Email Templates** (`service/src/email-templates/`): Define email content and formatting
5. **Notification Service** (`service/src/services/notification/notification.service.ts`): Orchestrates notification sending using a switch statement for event types

### Domain Structure:

- `space/`: Space and subspace-related notifications
- `platform/`: Platform-wide notifications (admin actions, global events)
- `organization/`: Organization-specific notifications
- `user/`: User-specific notifications (profile, direct messages)
- `virtual-contributor/`: Virtual contributor-related notifications

This simplified architecture makes adding new notifications much more straightforward while maintaining the domain-driven design principles.
