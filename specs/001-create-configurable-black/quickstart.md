# Quickstart: Configurable Email Blacklist for Notifications

## Configuring the Blacklist

- **Configuration mechanism (v1)**: A comma-separated list of exact email addresses provided via the environment variable `NOTIFICATIONS_EMAIL_BLACKLIST`.
- **Example (environment variable)**:

  ```bash
  NOTIFICATIONS_EMAIL_BLACKLIST="blocked1@example.org,blocked2@example.org,test@example.com"
  ```

- **Empty or missing configuration**:
  - Treated as "no blacklist" (empty list).
  - A verbose log message is emitted at service startup indicating the blacklist is empty.

- **Configuration format**:
  - Comma-separated email addresses (case-insensitive)
  - Whitespace around emails is automatically trimmed
  - Duplicate entries are automatically deduplicated
  - Invalid email formats are ignored with a warning logged

## Configuration Examples

### Example 1: Single blocked address
```bash
NOTIFICATIONS_EMAIL_BLACKLIST="blocked@example.org"
```

### Example 2: Multiple blocked addresses
```bash
NOTIFICATIONS_EMAIL_BLACKLIST="test1@test.com,test2@test.com,blocked@example.org"
```

### Example 3: With whitespace (handled gracefully)
```bash
NOTIFICATIONS_EMAIL_BLACKLIST="  blocked1@example.org , blocked2@example.org  "
```

### Example 4: No blacklist (default)
```bash
# Don't set the variable, or set it to empty
NOTIFICATIONS_EMAIL_BLACKLIST=""
```

## Reload / Restart Behavior

- **Changes to the blacklist take effect when**:
  - The notifications service is restarted (configuration is re-read at startup).
  - Hot-reload is NOT supported in v1 - service restart is required.

- **In-flight notifications**:
  - Notifications already being processed use the configuration loaded when processing began.
  - Newly processed notifications after restart use the updated configuration.

- **No downtime required**: The service can be restarted with minimal disruption due to RabbitMQ message queuing.

## Behavior Details

### Case Sensitivity
- Email matching is **case-insensitive**
- `BLOCKED@EXAMPLE.ORG`, `blocked@example.org`, and `Blocked@Example.Org` are all treated the same

### Invalid Entries
- Invalid email formats in the configuration are logged as warnings and ignored
- Valid entries continue to work even if some entries are invalid
- Example: `NOTIFICATIONS_EMAIL_BLACKLIST="valid@test.com,invalid-email,another@test.com"` will block `valid@test.com` and `another@test.com`, but ignore `invalid-email`

### Empty Recipients
- If all recipients are blacklisted, no emails are sent
- The notification is treated as successfully processed
- A log entry indicates all recipients were filtered

## End-to-End Validation (Constitution E2E Path)

### Manual Testing with Mailslurper

1. **Start support services** (from `service/` directory):
   ```bash
   npm run start:services
   ```

2. **Configure a blacklist**:
   ```bash
   export NOTIFICATIONS_EMAIL_BLACKLIST="blocked@example.org"
   ```

3. **Start the notifications service**:
   ```bash
   npm run start:dev
   ```

4. **Trigger a notification** to both blocked and allowed recipients:
   - Use RabbitMQ management UI or publish a test event
   - Include recipients: `blocked@example.org` and `allowed@example.org`

5. **Verify results**:
   - Check Mailslurper (http://localhost:2500) - only `allowed@example.org` should receive an email
   - Check service logs - should contain structured log entries showing `blocked@example.org` was filtered

### Expected Log Output

When a recipient is blocked, you should see logs like:
```json
{
  "event": "notification_blacklist_block",
  "recipient_email": "blocked@example.org",
  "reason": "blacklisted",
  "user_id": "user-123"
}
```

## Troubleshooting

### Issue: All emails are being sent (blacklist not working)
- **Check**: Is the `NOTIFICATIONS_EMAIL_BLACKLIST` environment variable set correctly?
- **Check**: Did you restart the service after changing the variable?
- **Check**: Are the email addresses in the blacklist exact matches (case doesn't matter, but typos do)?

### Issue: No emails are being sent at all
- **Check**: Did you accidentally blacklist all recipients?
- **Check**: Look for logs indicating "All recipients were filtered by blacklist"
- **Check**: Verify the blacklist configuration doesn't contain wildcards or patterns (v1 only supports exact matches)

### Issue: Warning about invalid email format
- **Action**: This is informational - the invalid entry will be ignored
- **Fix**: Correct the email address format in the configuration
- **Note**: Valid entries will continue to work
