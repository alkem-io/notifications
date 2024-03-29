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

1. Create a file under src/templates.
2. Copy welcome.js
3. Change the template name
4. Define your channels. You can use [this](https://github.com/notifme/notifme-template/tree/master/example) as an example.
5. In the file you want to use the template, import nunjucks and notifme-template.
6. Render your template

```typescript
const notification = await render('template_name', payload, 'en-US');
```

7. Send notification

```typescript
await notifmeSdk.send(notification.channels).then(console.log);
```

To test the welcome (sample) template, you can use the following payload in RabbitMQ Management UI

```json
{
  "pattern": "communityApplicationCreated",
  "data": {
    "applicantionCreatorID": "f0a47bad-eca5-4942-84ac-4dc9f085b7b8",
    "applicantID": "f0a47bad-eca5-4942-84ac-4dc9f085b7b8",
    "community": {
      "name": "02 Zero Hunger",
      "type": "challenge"
    },
    "space": {
      "id": "32818605-ef2f-4395-bb49-1dc2835c23de",
      "challenge": {
        "id": "7b86f954-d8c3-4fac-a652-b922c80e5c20",
        "opportunity": {
          "id": "636be60f-b64a-4742-8b50-69e608601935"
        }
      }
    }
  }
}
```

Note: replace applicantionCreatorID, applicantID, and space + challenge + opportunity IDs with IDs you have in your database. You can run the following gql queries to find them:

```gql
query {
  spaces {
    id
    displayName
    challenges {
      id
      displayName
      nameID
      community {
        id
        displayName
      }
      opportunities {
        displayName
        id
      }
    }
  }
}
```

```gql
query {
  me {
    id
  }
}
```
