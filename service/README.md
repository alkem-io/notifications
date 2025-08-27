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

To add a new notification type, follow this comprehensive process using the `SPACE_LEAD_COMMUNICATION_MESSAGE_DIRECT` pattern as an example:

### 1. Define the Event Payload Interface (lib)

Create a new notification event payload in the appropriate domain directory.

**Reference**: `lib/src/dto/space/notification.event.payload.space.communication.message.direct.ts`

- Extend the relevant base payload (e.g., `NotificationEventPayloadSpace`)
- Define event-specific properties (triggeredBy, message, etc.)
- Export it in the respective index file (`lib/src/dto/space/index.ts`)

### 2. Create the Email Template Payload Interface (service)

Define the email template payload interface.

**Reference**: `service/src/common/email-template-payload/space.communication.message.direct.email.payload.ts`

- Extend `BaseJourneyEmailPayload` (or `BaseEmailPayload` for non-journey notifications)
- Define email-specific data structure (messageSender, message, etc.)
- Export it in the email template payload index file

### 3. Implement the Notification Builder

Create a notification builder class that implements `INotificationBuilder`.

**Reference**: `service/src/services/domain/builders/space/space.lead.communication.message.direct.notification.builder.ts`

- Use `@Injectable()` decorator
- Implement `createEmailTemplatePayload()` method
- Transform event payload to email template payload
- Include `createUserNotificationPreferencesURL()` for recipient
- Export it in the builders index file (`service/src/services/domain/builders/index.ts`)

### 4. Create the Email Template

Create the email template file using Nunjucks templating.

**Reference**: `service/src/email-templates/space.lead.communication.message.direct.receiver.js`

- Use `module.exports = () => ({ ... })` format
- Include name, title, version, and channels
- Define email properties: to, replyTo, subject, html
- Use template variables from email payload (e.g., `{{messageSender.displayName}}`)
- Extend the base layout: `{% extends "src/email-templates/_layouts/email-transactional.html" %}`
- Include footer block: `${templates.footerBlock}`

### 5. Add Email Template Enum

Add the template name to the EmailTemplate enum.

**Reference**: `service/src/common/enums/email.template.ts`

- Add new entry matching the email template filename
- Use descriptive naming following existing patterns

### 6. Register the Builder in App Module

Add the builder to the providers in app module.

**Reference**: `service/src/app.module.ts`

- Import the notification builder class
- Add to the providers array

### 7. Inject and Use in Notification Service

Add the builder to the NotificationService constructor and create a method to use it.

**Reference**: `service/src/services/domain/notification/notification.service.ts`

- Inject the builder in constructor as private readonly
- Create public method that calls `processNotificationEvent()`
- Pass payload, builder instance, and EmailTemplate enum value

### 8. Update Tests

Add the builder to test providers in test files.

**Reference**: `service/src/services/domain/notification/notification.service.spec.ts`

- Add import for the notification builder
- Include in providers array for test module

### Important Notes

- Follow the domain structure (space/, platform/, organization/, user/)
- Use consistent naming conventions across all files
- Email template names should match the EmailTemplate enum values
- Always extend the appropriate base payload interfaces
- Implement the INotificationBuilder interface for all builders
- Export all new classes/interfaces in their respective index files

## Additional Information

After the latest refactoring, the code follows the domain structure of the `server`.
Most notification payloads, categories, and related enums or types have been deleted, focusing the codebase solely on email/external notifications. Types are obtained with codegen.
There's no additional service/sdk communication logic. The service receives all the required data - payload with recipients.
There are no additional checks, just sending the matched template to the provided set of recipients.

### New DTO Structure:

- Notification payloads now use more specific interfaces, grouped under folders like `space/`, `platform/`, `organization/`, and `user/`.
- DTOs now use `UserPayload` and `ContributorPayload` types for strong typing of `users/recipients`.

### Architecture Overview:

The notification service follows a clean architecture pattern:

1. **Event Payloads** (`lib/src/dto/`): Define the data structure for incoming notification events
2. **Email Template Payloads** (`service/src/common/email-template-payload/`): Define the data structure for email template rendering
3. **Notification Builders** (`service/src/services/domain/builders/`): Transform event payloads into email template payloads
4. **Email Templates** (`service/src/email-templates/`): Define the actual email content and formatting
5. **Notification Service** (`service/src/services/domain/notification/`): Orchestrates the notification sending process

### Domain Structure:

- `space/`: Notifications related to spaces and their activities
- `platform/`: Platform-wide notifications (admin actions, global events)
- `organization/`: Organization-specific notifications
- `user/`: User-specific notifications (profile, direct messages)
- `virtual-contributor/`: Virtual contributor-related notifications

This structure ensures maintainability and follows the domain-driven design principles used throughout the Alkemio platform.
