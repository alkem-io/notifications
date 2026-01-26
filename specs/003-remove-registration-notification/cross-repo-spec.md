# Cross-Repository Specification: Registration Notification Migration to Kratos

**Date**: 2026-01-26
**Source Repository**: alkem-io/notifications
**Target Repositories**: infrastructure-operations, dev-orchestration
**Related Issue**: [alkem-io/client-web#9197](https://github.com/alkem-io/client-web/issues/9197)

## Summary

The Alkemio notifications service is removing the "Registration successful!" user welcome email notification (`UserSignUpWelcome` event). The welcome messaging previously sent via this notification must be migrated to the Kratos email verification success template.

**Note**: The `PlatformAdminUserProfileCreated` notification (sent to platform admins when a new user registers) is NOT being removed - it remains unchanged.

## Background

With the updated identity management flow, user profiles are now created in both Ory Kratos and Alkemio simultaneously during registration. This results in the "Registration successful!" notification being sent prematurely - before the user has completed email verification.

**Solution**: Consolidate all welcome messaging into the Kratos email verification success template, ensuring users receive a single, coherent welcome email after completing email verification.

## Deployment Order

| Step | Repository | Action | Status |
|------|------------|--------|--------|
| 1 | alkem-io/notifications | Remove registration notification handler | **Complete** |
| 2 | infrastructure-operations | Update Kratos email verification template | Pending |
| 3 | dev-orchestration | Update dev environment Kratos configuration | Pending |

**Important**: Steps 2 and 3 can be done in parallel after step 1 is deployed. During the transition between step 1 and steps 2-3, users will not receive the welcome content that was previously in the registration notification. This is an accepted temporary gap.

---

## Content to Migrate

### Current Registration Notification Content

**Source File**: `service/src/email-templates/user.sign.up.welcome.js`

#### Subject Line
```
Alkemio - Registration successful!
```

#### Email Body (HTML - Exact Template Content)

```html
<p>Dear {{registrant.firstName}},</p>
<p>Welcome aboard the Alkemio platform! Your account creation was a success — congratulations! 🎉 Perhaps you have already explored the platform, but let's ensure you are fully equipped to dive in with the links below.</p><br>
    <p>🌐 <a style="color:#000000; text-decoration: none;" href="https://alkem.io/home"><b>Find Spaces</b>: At Alkemio, users collaborate within Spaces. If you are looking for a particular Space, use the search functionality on your Dashboard</a>.</p>
    <p>🚀 <a style="color:#000000; text-decoration: none;" href="https://alkem.io/welcome-space"><b>Explore the possibilities</b>: Take a peek at our Welcome Space — it's an open Space for you to explore the platform's structure and functionality.</a></p>
    <p>📸 <a style="color:#000000; text-decoration: none;" href="{{registrant.profile}}"><b>Personalize Your Profile</b>: Add a friendly photo to your profile so fellow users can put a face to your name.</a></p>
    <p>💌 <a style="color:#000000; text-decoration: none;" href="mailto:community@alkem.io"><b>Need Assistance?</b>: Whether you're keen on starting your own Space or require support, our Community team is here for you. Reach out anytime at <b>community@alkem.io</b></a>.</p>
    <p><a style="color:#000000; text-decoration: none;" href="https://welcome.alkem.io">❔ <b>Learn More</b>: For additional details about Alkemio, check out our website</a>.</p>
    <br>
<p>We are looking forward to seeing your interactions and contributions!</p>
<p>Warm regards,</p>
<p>The Alkemio Team 🌟</p>
```

**Note**: The template uses Nunjucks syntax (`{{registrant.firstName}}`, `{{registrant.profile}}`). Kratos templates use Go template syntax - adjust accordingly.

#### Plain Text Version

```
Dear {{firstName}},

Welcome aboard the Alkemio platform! Your account creation was a success - congratulations!

FIND SPACES: At Alkemio, users collaborate within Spaces. If you are looking for a particular Space, use the search functionality on your Dashboard.
https://alkem.io/home

EXPLORE THE POSSIBILITIES: Take a peek at our Welcome Space - it's an open Space for you to explore the platform's structure and functionality.
https://alkem.io/welcome-space

PERSONALIZE YOUR PROFILE: Add a friendly photo to your profile so fellow users can put a face to your name.
{{profileUrl}}

NEED ASSISTANCE?: Whether you're keen on starting your own Space or require support, our Community team is here for you. Reach out anytime at community@alkem.io

LEARN MORE: For additional details about Alkemio, check out our website.
https://welcome.alkem.io

We are looking forward to seeing your interactions and contributions!

Warm regards,
The Alkemio Team
```

---

## Template Variables

The following variables are used in the current notification. Map these to Kratos template variables:

| Current Variable | Description | Kratos Equivalent |
|------------------|-------------|-------------------|
| `{{firstName}}` | User's first name | `{{ .Identity.traits.name.first }}` (verify trait path) |
| `{{profileUrl}}` | URL to user's profile page | Use static URL `https://alkem.io/user/me` (redirects to logged-in user's profile) |

**Note**: Kratos templates use Go template syntax. Adjust variables according to your Kratos identity schema.

---

## Target Kratos Template

### Template Location

The email verification success template should be located at one of:
- `templates/verification/valid/email.body.html`
- `templates/verification/valid/email.body.plaintext`

Or configured in Kratos config:
```yaml
courier:
  templates:
    verification:
      valid:
        email:
          body:
            html: "file:///path/to/template.html"
            plaintext: "file:///path/to/template.txt"
```

### Recommended Updated Template Structure

```html
<!-- Email Verification Success with Welcome Content -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Verified - Welcome to Alkemio</title>
</head>
<body>
  <p>Dear {{ .Identity.traits.name.first }},</p>

  <!-- Verification confirmation -->
  <p>Your email address has been successfully verified.</p>

  <!-- Welcome content (migrated from notifications service) -->
  <p>Welcome aboard the Alkemio platform! Your account creation was a success - congratulations!</p>

  <p><a href="https://alkem.io/home"><b>Find Spaces</b></a>: At Alkemio, users collaborate within Spaces. If you are looking for a particular Space, use the search functionality on your Dashboard.</p>

  <p><a href="https://alkem.io/welcome-space"><b>Explore the possibilities</b></a>: Take a peek at our Welcome Space - it's an open Space for you to explore the platform's structure and functionality.</p>

  <p><a href="https://alkem.io/user/me"><b>Personalize Your Profile</b></a>: Add a friendly photo to your profile so fellow users can put a face to your name.</p>

  <p><a href="mailto:community@alkem.io"><b>Need Assistance?</b></a>: Whether you're keen on starting your own Space or require support, our Community team is here for you. Reach out anytime at <b>community@alkem.io</b>.</p>

  <p><a href="https://welcome.alkem.io"><b>Learn More</b></a>: For additional details about Alkemio, check out our website.</p>

  <p>We are looking forward to seeing your interactions and contributions!</p>

  <p>Warm regards,<br>The Alkemio Team</p>
</body>
</html>
```

---

## Verification Checklist

Infrastructure team must verify the following before deploying the updated Kratos template:

### Content Migration

- [ ] Subject line includes welcome messaging or is updated appropriately
- [ ] User's first name is displayed (verify trait path in your identity schema)
- [ ] "Find Spaces" section with link to https://alkem.io/home
- [ ] "Explore the possibilities" section with link to https://alkem.io/welcome-space
- [ ] "Personalize Your Profile" section with link to user's profile
- [ ] "Need Assistance?" section with community@alkem.io contact
- [ ] "Learn More" section with link to https://welcome.alkem.io
- [ ] Closing message: "We are looking forward to seeing your interactions and contributions!"
- [ ] Sign-off: "Warm regards, The Alkemio Team"

### Technical Verification

- [ ] Template renders correctly in Kratos test email
- [ ] All template variables resolve correctly
- [ ] HTML email renders properly in major email clients (Gmail, Outlook, Apple Mail)
- [ ] Plain text fallback is readable
- [ ] Email is sent upon successful verification (not before)

### Side-by-Side Comparison

| Content Element | Old Notification | New Kratos Template | Verified |
|-----------------|------------------|---------------------|----------|
| Subject | "Alkemio - Registration successful!" | [Update] | [ ] |
| Greeting | "Dear {{firstName}}" | "Dear {{ .Identity.traits.name.first }}" | [ ] |
| Welcome message | Present | Present | [ ] |
| Find Spaces link | https://alkem.io/home | https://alkem.io/home | [ ] |
| Welcome Space link | https://alkem.io/welcome-space | https://alkem.io/welcome-space | [ ] |
| Profile link | Dynamic ({{profileUrl}}) | Dynamic | [ ] |
| Community email | community@alkem.io | community@alkem.io | [ ] |
| Learn More link | https://welcome.alkem.io | https://welcome.alkem.io | [ ] |
| Sign-off | "The Alkemio Team" | "The Alkemio Team" | [ ] |

---

## Files to Modify

### infrastructure-operations

| File/Path | Action |
|-----------|--------|
| `[kratos-templates-path]/verification/valid/email.body.html` | Update with welcome content |
| `[kratos-templates-path]/verification/valid/email.body.plaintext` | Update with welcome content |
| `[kratos-config-path]/kratos.yml` | Verify template paths (if needed) |

### dev-orchestration

| File/Path | Action |
|-----------|--------|
| `[dev-kratos-templates-path]/verification/valid/email.body.html` | Update with welcome content |
| `[dev-kratos-templates-path]/verification/valid/email.body.plaintext` | Update with welcome content |

---

## Testing Instructions

1. **Local Development Testing**:
   - Start Kratos with updated templates
   - Register a new user
   - Complete email verification
   - Verify the email contains all welcome content

2. **Staging Environment Testing**:
   - Deploy updated templates to staging
   - Register test user
   - Verify email content matches specification
   - Verify email renders correctly

3. **Production Deployment**:
   - Deploy after notifications service update is live
   - Monitor for any email delivery issues
   - Verify first few production registrations receive correct email

---

## Rollback Plan

If issues are discovered after deployment:

1. **Kratos template rollback**: Revert to previous template version
2. **Notifications service**: Can be re-enabled by reverting the removal commit

Note: There is no mechanism to re-send welcome emails to users who registered during the transition period. This is an accepted limitation.

---

## Contact

For questions about this specification:
- **Notifications service changes**: alkem-io/notifications repository
- **Original issue**: [alkem-io/client-web#9197](https://github.com/alkem-io/client-web/issues/9197)
