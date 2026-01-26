# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Alkemio out-of-band notifications service - a small monorepo with two Node.js projects:
- **`service/`**: NestJS microservice that receives events via AMQP/RabbitMQ, builds email payloads, and sends notifications using notifme-sdk
- **`lib/`**: TypeScript library (`@alkemio/notifications-lib`) exposing shared DTOs and types for notification events

## Build Commands

### Service (`service/`)
```bash
cd service
npm install
npm run build          # Compile TypeScript (runs rimraf dist first)
npm test               # Run Jest tests
npm run lint           # tsc --noEmit && eslint
npm run lint:fix       # Lint with auto-fix
```

### Library (`lib/`)
```bash
cd lib
npm install
npm run build          # tsc --project tsconfig.prod.json
# Note: npm run lint fails due to missing eslint.config.js - use tsc --noEmit for type checking
```

### Running the Service
```bash
npm run start:dev      # Development with watch mode
npm run start:prod     # Production (requires build first)
npm run start:debug    # Debug mode on port 9230
npm run start:services # Start mailslurper for local email testing
```

## Architecture

### Notification Flow
1. **Event received** via RabbitMQ → `NotificationService.processNotificationEvent()`
2. **Payload transformation** → `NotificationEmailPayloadBuilderService` converts event payload to email payload
3. **Template rendering** → Nunjucks templates in `service/src/email-templates/`
4. **Email delivery** → notifme-sdk handles sending

### Key Files
- `service/src/services/notification/notification.service.ts`: Central orchestrator with switch statements mapping events to templates and payload builders
- `service/src/services/notification/notification.email.payload.builder.service.ts`: Consolidated service for all event-to-email payload transformations
- `service/src/services/notification/notification.blacklist.service.ts`: Email blacklist filtering (GraphQL-synced or static)
- `service/src/generated/alkemio-schema.ts`: Generated GraphQL types (regenerate with `npm run codegen`)

### Domain Structure
Both `lib/src/dto/` (event payloads) and `service/src/services/notification/email-template-payload/` (email payloads) follow the same domain organization:
- `space/` - Space and subspace notifications
- `platform/` - Platform-wide admin notifications
- `organization/` - Organization-specific notifications
- `user/` - User profile and direct message notifications

### Adding a New Notification
1. Define event payload in `lib/src/dto/<domain>/` extending the appropriate base payload
2. Create email template payload interface in `service/src/services/notification/email-template-payload/`
3. Add transformation method to `notification.email.payload.builder.service.ts`
4. Create Nunjucks email template in `service/src/email-templates/`
5. Add cases to both switch statements in `notification.service.ts`:
   - `createEmailPayloadForEvent()` - maps event to builder method
   - `getEmailTemplateToUseForEvent()` - maps event to template filename

## Tech Stack & Versions
- Node.js 22.x (service), Node.js 20.x (lib) - managed via Volta
- TypeScript 5.8, NestJS 11, Jest, ESLint 9 flat config
- RabbitMQ for message queue, notifme-sdk for email delivery

## Known Issues
- `lib/` lint fails (missing eslint.config.js) - rely on TypeScript build for validation
- Jest warns about `.js` email templates - tests still pass
- `.eslintignore` deprecation warning in service lint - informational only

## Testing Email Locally
1. `npm run start:services` (starts mailslurper)
2. Publish test message to RabbitMQ at http://localhost:15672/#/queues/%2F/alkemio-notifications
3. Check emails at http://localhost:5051/mail

## Recent Changes
- 003-remove-registration-notification: Removed USER_SIGN_UP_WELCOME notification (user welcome email). PLATFORM_ADMIN_USER_PROFILE_CREATED notification remains unchanged.
