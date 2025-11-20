# Quickstart: Testing GraphQL-Sourced Notification Email Blacklist

This quickstart explains how to validate that the notifications service respects the GraphQL-managed notification email blacklist.

## Prerequisites

- Alkemio platform instance running with PR #5622 (or equivalent) deployed.
- Notifications service built and running against that platform (e.g., via `docker-run: release` or `npm run start:dev` in `service/`).
- Service configuration updated to:
  - Point to the correct GraphQL endpoint (e.g., `ALKEMIO_SERVER_ENDPOINT`).
  - Provide a valid machine-to-machine token for GraphQL access.
  - Enable GraphQL blacklist sync and set the refresh interval (default 5 minutes).

## Steps: Happy Path (Blacklist Blocks Email)

1. **Add an email to the blacklist via GraphQL**
   - In the platform, execute the mutation (e.g. via GraphQL Playground or API client):
     - `addNotificationEmailToBlacklist(email: "blocked@example.com")`.
2. **Wait for the sync window**
   - Wait for at most the configured refresh interval (default 5 minutes) for the notifications service to fetch the updated blacklist.
   - Optionally, verify logs from the notifications service showing a successful blacklist sync.
3. **Trigger a notification to the blacklisted email**
   - Use an existing flow (e.g., create a test user or action that sends a notification to `blocked@example.com`).
4. **Verify outcome**
   - Confirm that no email is delivered to `blocked@example.com` (e.g., check mailslurper or your email sink).
   - Check logs to confirm that the notification was filtered due to the blacklist.

## Steps: Removal Path (Email Unblocked)

1. **Remove the email from the blacklist**
   - Execute the mutation:
     - `removeNotificationEmailFromBlacklist(email: "blocked@example.com")`.
2. **Wait for the next sync**
   - Wait for up to the refresh interval again.
3. **Trigger the same notification**
   - Repeat the action that sends a notification to `blocked@example.com`.
4. **Verify outcome**
   - Confirm that the email is now delivered.
   - Confirm logs show a non-blacklisted decision for this recipient.

## Steps: Failure Path (GraphQL Unavailable)

1. **Simulate GraphQL outage**
   - Temporarily block access from the notifications service to the GraphQL endpoint (e.g., by changing the endpoint to an invalid host in a dev environment or using a network rule).
2. **Restart or wait for next refresh**
   - Restart the notifications service or wait for the next scheduled sync.
3. **Trigger notifications for non-blacklisted users**
   - Send notifications to one or more emails not present in any known blacklist.
4. **Verify outcome**
   - Confirm that notifications are still delivered for non-blacklisted users.
   - Confirm that logs show blacklist sync failures but no service crash, and that the previous snapshot (if any) is still in effect.

## Commands (Local Service)

From the `service/` directory:

```bash
npm install
npm run build
npm test
npm run start:dev
```

Use the above commands to build, test, and run the service while performing the steps described.
