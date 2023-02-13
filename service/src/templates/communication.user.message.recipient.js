// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.user.message.recipient',
  title: '{{messageSender.displayName}} sent you a message!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      replyTo: '{{messageSender.email}}',
      subject: '{{messageSender.displayName}} sent you a message!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          You have a message from user {{messageSender.displayName}}:
          <br><br>======<br>
          {{message}}
          <br>======<br><br>
          You can reply to this email to respond directly to {{messageSender.firstName}}.
          <br><br>
          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
