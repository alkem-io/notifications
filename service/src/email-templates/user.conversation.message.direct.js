// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var conversationTemplates = require('./conversation.message.template.blocks');
/* eslint-disable quotes */
// 034-messaging-notifications (contract C-2, FR-008/FR-009, D-15): unlike the
// legacy `user.message.recipient` template, this one NEVER sets `replyTo` and
// NEVER renders message text — only `sender.displayName` (trusted field) and
// the conversation deep link (C-6). Do not add a `replyTo` key here or copy
// this pattern back onto `user.message.recipient`/`user.message.sender`.
module.exports = () => ({
  name: 'user.conversation.message.direct',
  title: '{{sender.displayName}} sent you a message',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{sender.displayName}} sent you a message',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          <b>{{sender.displayName}}</b> sent you a new message on Alkemio.
          <br><br>
          ${conversationTemplates.conversationActionButton}<br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
