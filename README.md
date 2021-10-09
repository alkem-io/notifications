# notifications

Alkemio out-of-band notifications service.

## To test

1. Start quickstart-services from the server repo with defaults.
2. Start mailslurper:

```
docker-compose -f quickstart-mailslurper.yml up --build --force-recreate
```

3. Start notification service `npm start`.
4. Go to http://localhost:15672/#/queues/%2F/alkemio-notifications.
5. Under publish message, select content_type under properties with value application/json.
6. Select payload:

```json
{
  "data": "YOUR_DATA"
}
```

7. Click publish.
8. Navigate to http://localhost:5051/mailcount. You will see mailCount > 0 (mailslurper will reset the count on each restart).
9. Navigate to http://localhost:5051/mail. Search for YOUR_DATA. You will find it in the mail message.
