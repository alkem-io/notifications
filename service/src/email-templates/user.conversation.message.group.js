// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var conversationTemplates = require('./conversation.message.template.blocks');
/* eslint-disable quotes */
// 034-messaging-notifications (contract C-2, FR-008/FR-009/FR-018a, D-15),
// revised for Operator Ruling R4: sibling of user.conversation.message.direct.js
// — a DIGEST of the recipient's unread GROUP conversations. NEVER sets
// `replyTo`, NEVER renders message text, and carries NO sender identity at all
// (the payload has none): the group digest names conversations, never who said
// what. Emails address recipients individually (one send per recipient) — no
// participant list leakage (D-15).
//
// `subjectLine` is resolved in the payload builder (data-model §9.1 copy
// matrix) — see the direct template's header for why the plural branching must
// not live in the plain-text render environment.
module.exports = () => ({
  name: 'user.conversation.message.group',
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
          ${conversationTemplates.digestRows('conversations')}
          <br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
