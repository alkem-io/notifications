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
