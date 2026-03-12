# Quickstart: Community Poll Notification Emails

**Feature**: 003-poll-notifications | **Branch**: `003-poll-notifications`

## Prerequisites

- Node.js 22.x (service) / 20.x (lib) — managed by Volta
- RabbitMQ running locally (or via `npm run start:services`)
- Updated GraphQL schema with the four new `NotificationEvent` enum values

## Setup

```bash
# Install dependencies
cd lib && npm install && npm run build && cd ..
cd service && npm install && npm run build && cd ..
```

## Development Workflow

### 1. Start with the lib (event payload DTOs)

Files to create/modify in `lib/src/dto/space/`:
- `poll.payload.ts` — shared poll type
- Four event payload interfaces extending `NotificationEventPayloadSpace`
- Update `index.ts` barrel exports

Build: `cd lib && npm run build`

### 2. Add email template payloads in service

Files to create in `service/src/services/notification/email-template-payload/`:
- `space.poll.vote.cast.email.payload.ts`
- `space.poll.modified.email.payload.ts`
- Update `index.ts` barrel exports

### 3. Add builder methods

In `service/src/services/notification/notification.email.payload.builder.service.ts`:
- Add four methods following the `createEmailTemplatePayload*` naming pattern
- Use `createSpaceBaseEmailPayload()` helper for base fields

### 4. Register events in notification service

In `service/src/services/notification/notification.service.ts`:
- Add four cases to `createEmailPayloadForEvent()` switch
- Add four cases to `getEmailTemplateToUseForEvent()` switch

### 5. Create email templates

Four `.js` files in `service/src/email-templates/`, extending `email-transactional.html`.

### 6. Update generated schema

If the server schema is updated:
```bash
cd service && npm run codegen
```

## Testing

```bash
# Run service tests
cd service && npm test

# Manual E2E test
npm run start:services   # Starts mailslurper
npm run start:dev        # Starts service in watch mode
```

Publish test messages to RabbitMQ at `http://localhost:15672/#/queues/%2F/alkemio-notifications`.

Example payload for `SPACE_COLLABORATION_POLL_VOTE_CAST_ON_OWN_POLL`:
```json
{
  "eventType": "SPACE_COLLABORATION_POLL_VOTE_CAST_ON_OWN_POLL",
  "triggeredBy": {
    "id": "voter-id",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane@example.com",
    "type": "user",
    "profile": { "displayName": "Jane Doe", "url": "https://app.alkemio.io/user/jane-doe" }
  },
  "recipients": [{
    "id": "creator-id",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john@example.com",
    "type": "user",
    "profile": { "displayName": "John Smith", "url": "https://app.alkemio.io/user/john-smith" }
  }],
  "platform": { "url": "https://app.alkemio.io" },
  "space": {
    "id": "space-id",
    "level": "space",
    "profile": { "displayName": "Climate Action", "url": "https://app.alkemio.io/space/climate-action" },
    "adminURL": "https://app.alkemio.io/space/climate-action/settings"
  },
  "poll": {
    "id": "poll-123",
    "title": "What should our next initiative focus on?",
    "calloutId": "callout-456",
    "calloutTitle": "Community Polls",
    "calloutUrl": "https://app.alkemio.io/space/climate-action/collaboration/polls/poll-123"
  }
}
```

Check delivered emails at `http://localhost:5051/mail`.
