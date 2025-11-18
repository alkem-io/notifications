# Quickstart: Configurable Email Blacklist for Notifications

## Configuring the Blacklist

- Configuration mechanism (v1): A list of exact email addresses provided via an environment variable or equivalent configuration key (e.g., `NOTIFICATIONS_EMAIL_BLACKLIST`).
- Example (environment variable):

  - `NOTIFICATIONS_EMAIL_BLACKLIST="blocked1@example.org,blocked2@example.org"`

- Empty or missing configuration:
  - Treated as "no blacklist" (empty list).
  - A warning is logged once at startup.

## Reload / Restart Behavior

- Changes to the blacklist take effect when:
  - The notifications service is restarted (config is re-read at startup).
- In-flight notifications:
  - Notifications already being processed use the configuration that was loaded when processing began.
  - Newly processed notifications after restart use the updated configuration.

## End-to-End Validation (Constitution E2E Path)

Use T015 (see `tasks.md`) or an equivalent manual flow:

1. Configure a blacklist including `blocked@example.org`.
2. Trigger a notification to `blocked@example.org` and `allowed@example.org`.
3. Verify:
   - Only `allowed@example.org` receives an email (for example, via mailslurper).
   - Logs contain a structured entry indicating `blocked@example.org` was skipped due to the blacklist.
