// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var conversationTemplates = require('./conversation.message.template.blocks');
/* eslint-disable quotes */
// 034-messaging-notifications (contract C-2, FR-008/FR-009, D-15), revised for
// Operator Ruling R4: this is a DIGEST of the recipient's unread 1:1
// conversations, not one email per message. Unlike the legacy
// `user.message.recipient` template it NEVER sets `replyTo` and NEVER renders
// message text — only counterpart display names, their unread counts, and the
// per-conversation deep links (C-6). Do not add a `replyTo` key here or copy
// this pattern back onto `user.message.recipient`/`user.message.sender`.
//
// `subjectLine` is resolved in the payload builder (data-model §9.1 copy
// matrix), because the subject/title is re-rendered through the bare
// non-autoescaping nunjucks Environment in `notification.templates.builder.ts`,
// which only guarantees `{{ }}` interpolation — no plural branching here.
module.exports = () => ({
  name: 'user.conversation.message.direct',
  title: '{{subjectLine}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{subjectLine}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          {{subjectLine}} on Alkemio.
          <br><br>
          ${conversationTemplates.digestRows('senders')}
          <br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
