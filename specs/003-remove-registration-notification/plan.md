# Implementation Plan: Remove Registration Successful Notification

**Branch**: `003-remove-registration-notification` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-remove-registration-notification/spec.md`

## Summary

Remove the "Registration successful!" notification from the Alkemio notifications service. With updated identity management, user profiles are now created in both Ory Kratos and Alkemio simultaneously, making the separate registration notification obsolete. The welcome messaging will be consolidated into the Kratos email verification template (handled by infrastructure repositories).

## Technical Context

**Language/Version**: TypeScript 5.8, Node.js 22.x (service), Node.js 20.x (lib)
**Primary Dependencies**: NestJS 11, notifme-sdk, Nunjucks templates
**Storage**: N/A (no database changes)
**Testing**: Jest
**Target Platform**: Linux server (Docker container)
**Project Type**: NestJS microservice
**Performance Goals**: N/A (removal only)
**Constraints**: Backward compatibility during deployment - stray events throw EventPayloadNotProvidedException (fail-early behavior preserved)
**Scale/Scope**: Affects 2 notification types, ~8 files modified/deleted

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASS - Constitution uses placeholder template; no specific project gates defined.

## Project Structure

### Documentation (this feature)

```text
specs/003-remove-registration-notification/
├── plan.md                    # This file
├── research.md                # Phase 0 output
├── cross-repo-spec.md         # Output document for infrastructure repos
└── tasks.md                   # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
service/
├── src/
│   ├── email-templates/
│   │   ├── user.sign.up.welcome.js          # TO DELETE
│   │   └── platform.admin.user.profile.created.js  # KEEP (admin notification)
│   ├── services/
│   │   └── notification/
│   │       ├── notification.service.ts      # MODIFY: Remove 2 case statements (USER_SIGN_UP_WELCOME only)
│   │       ├── notification.email.payload.builder.service.ts  # MODIFY: Remove 1 method (user welcome only)
│   │       └── email-template-payload/
│   │           └── platform.user.registered.email.payload.ts  # KEEP (used by admin notification)
│   └── generated/
│       └── alkemio-schema.ts                # NO CHANGE (auto-generated)
└── test/                                     # No related tests exist

lib/
└── src/
    └── dto/
        └── platform/
            └── notification.event.payload.platform.user.registration.ts  # KEEP (may be used by server)
```

**Structure Decision**: Single project (service/) with shared library (lib/). No structural changes required.

## Complexity Tracking

> No constitution violations - standard code removal.

## Files to Modify

### Files to DELETE

| File | Reason |
|------|--------|
| `service/src/email-templates/user.sign.up.welcome.js` | User welcome email template no longer needed |

### Files to MODIFY

| File | Changes |
|------|---------|
| `service/src/services/notification/notification.service.ts` | Remove 2 case statements for `USER_SIGN_UP_WELCOME` only |
| `service/src/services/notification/notification.email.payload.builder.service.ts` | Remove 1 builder method (`createEmailTemplatePayloadUserSignUpWelcome`) |

### Files to KEEP (no changes)

| File | Reason |
|------|--------|
| `lib/src/dto/platform/notification.event.payload.platform.user.registration.ts` | May be used by server (alkem-io/server) - removal would be breaking change |
| `service/src/services/notification/email-template-payload/platform.user.registered.email.payload.ts` | Used by admin notification builder |
| `service/src/email-templates/platform.admin.user.profile.created.js` | Admin notification is kept |
| `service/src/generated/alkemio-schema.ts` | Auto-generated from GraphQL schema - enum values remain |

## Content to Migrate to Kratos

The following content from `user.sign.up.welcome.js` must be migrated to the Kratos email verification success template:

### Subject Line
```
Alkemio - Registration successful!
```

### Email Body Content
```html
Dear {{registrant.firstName}},

Welcome aboard the Alkemio platform! Your account creation was a success - congratulations!

- Find Spaces: At Alkemio, users collaborate within Spaces. Use search on your Dashboard.
  Link: https://alkem.io/home

- Explore the possibilities: Visit our Welcome Space to explore the platform.
  Link: https://alkem.io/welcome-space

- Personalize Your Profile: Add a friendly photo to your profile.
  Link: {{registrant.profile}}

- Need Assistance?: Contact community@alkem.io

- Learn More: Visit https://welcome.alkem.io

We are looking forward to seeing your interactions and contributions!

Warm regards,
The Alkemio Team
```

### Dynamic Fields Used
- `{{registrant.firstName}}` - User's first name
- `{{registrant.profile}}` - URL to user's profile page
- `{{recipient.email}}` - Recipient email address

## Deployment Strategy

1. **Phase 1**: Deploy notifications service with user registration notification removed
   - Stray `USER_SIGN_UP_WELCOME` events will throw `EventPayloadNotProvidedException` (fail-early behavior preserved)
   - `PLATFORM_ADMIN_USER_PROFILE_CREATED` continues to work normally (admin notification kept)

2. **Phase 2**: Update Kratos email templates in infrastructure-operations and dev-orchestration

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Stray events during transition | Fail-early behavior throws `EventPayloadNotProvidedException`; events rejected |
| Users miss welcome content | Kratos template update includes all content (verified via cross-repo spec) |
| Breaking change to lib consumers | Keep DTO in lib/ - server may still send events during transition |

## Output Documents

1. **research.md** - Technical decisions and alternatives considered
2. **cross-repo-spec.md** - Specification for infrastructure-operations and dev-orchestration repositories
