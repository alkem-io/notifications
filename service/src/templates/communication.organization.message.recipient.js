// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.organization.message.recipient',
  title: '{{messageSender.displayName}} sent you a message!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      replyTo: '{{messageSender.email}}',
      subject:
        '{{messageSender.displayName}} sent a message to your organization!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          User {{messageSender.displayName}} sent a message to {{organization.displayName}}:
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
