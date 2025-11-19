# Research Notes: Configurable Email Blacklist

## Logging Format for Blacklist Blocks

Proposed log fields (JSON or structured logger fields):

- `event`: `"notification_blacklist_block"`
- `recipient_email`: `<blocked email>`
- `reason`: `"blacklisted"`
- `notification_type`: `<event/template identifier>`
- `correlation_id` or `event_id`: `<existing ID where available>`

These fields underpin SC-003 (operations can identify the reason for a block quickly).

## Metrics (If Available)

- Metric name (example): `notifications_blacklist_blocks_total`
- Labels:
  - `notification_type`
  - (optional) `tenant_id` or similar, if easily available

This metric supports monitoring trends and provides evidence for SC-004 (ticket reduction).

## Success Criteria Measurement Notes

- SC-003 (investigation time):
  - Measured qualitatively via incident runbooks; logging format and correlation IDs must allow operators to identify blacklist blocks in under 5 minutes during troubleshooting.
- SC-004 (ticket reduction):
  - Track support tickets tagged with an "unwanted-notification"-style label before and after rollout.
  - This feature is a contributing factor; exact percentage is approximate and depends on adoption and upstream behavior.
