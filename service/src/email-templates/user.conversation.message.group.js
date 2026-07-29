// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var conversationTemplates = require('./conversation.message.template.blocks');
/* eslint-disable quotes */
// 034-messaging-notifications (contract C-2, FR-008/FR-009, D-15): sibling of
// user.conversation.message.direct.js — NEVER sets `replyTo`, NEVER renders
// message text; only `sender.displayName` + `conversation.displayName`
// (trusted fields) and the conversation deep link (C-6). Emails address
// recipients individually (one send per recipient) — no participant list
// leakage (D-15).
module.exports = () => ({
  name: 'user.conversation.message.group',
  title: '{{sender.displayName}} sent a message in {{conversation.displayName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{sender.displayName}} sent a message in {{conversation.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          <b>{{sender.displayName}}</b> sent a new message in <b>{{conversation.displayName}}</b> on Alkemio.
          <br><br>
          ${conversationTemplates.conversationActionButton}<br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
