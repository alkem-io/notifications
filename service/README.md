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

## Templates

To add a template:

1. Create a new file in the appropriate domain directory (e.g., `lib/src/dto/space/notification.event.payload.space.mynewtype.ts`);
2. Define your interface, extending the relevant base payload (e.g., `NotificationEventPayloadSpace`)
3. Create or update the email payload TypeScript file under `service/src/common/email-template-payload/`, using the new naming convention (e.g., `space.mynewtype.email.payload.ts`).
4. Implement a notification builder class in `service/src/services/domain/builders/space/`.
5. Register your builder in `app.module.ts` providers.
6. Add or update the email template in `service/src/email-templates/`

## Additional Information

After the latest refactoring the code follows the domain structure of the `server`.
Most notification payloads, categories, and related enums or types have been deleted, focusing the codebase solely on email/external notifications. Types are obtain with codegen.
There's no additional service/sdk communication logic. The service receives all the required data - payload with recipients.
There are no additional checks, just sending the matched template to the provided set of recipients.

### New DTO Structure:

- Notification payloads now use more specific interfaces, grouped under folders like `space/`, `platform/`, `organization/`, and `user/`.
- DTOs now use `UserPayload` and `ContributorPayload` types for strong typing of `users/recipients`.
