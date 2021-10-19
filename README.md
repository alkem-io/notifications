# notifications

Alkemio out-of-band notifications service.

[![Build Status](https://app.travis-ci.com/alkem-io/notifications.svg?branch=develop)](https://app.travis-ci.com/alkem-io/notifications.svg?branch=develop)
[![Coverage Status](https://coveralls.io/repos/github/alkem-io/notifications/badge.svg?branch=develop)](https://coveralls.io/github/alkem-io/notifications?branch=develop)
[![BCH compliance](https://bettercodehub.com/edge/badge/alkem-io/notifications?branch=develop)](https://bettercodehub.com/)
[![Coverage Status](https://github.com/alkem-io/notifications/workflows/Docker%20Image%20CI/badge.svg?branch=develop)](https://github.com/alkem-io/notifications/workflows/Docker%20Image%20CI/badge.svg?branch=develop)

## To test

1. Start quickstart-services from the server repo with defaults.
2. Start mailslurper:

```
docker-compose -f quickstart-mailslurper.yml -f quickstart-notifications.yml --env-file .env.docker up --build --force-recreate
```

3. Go to http://localhost:15672/#/queues/%2F/alkemio-notifications.
4. Under publish message, select content_type under properties with value application/json.
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
  "data": {
    "emailFrom": "info@alkem.io",
    "user": {
      "firstname": "Valentin",
      "email": "valentin@alkem.io"
    }
  }
}
```
