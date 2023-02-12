// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.community.leads.message.recipient',
  title: '{{messageSender.displayName}} sent a message to your community!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      replyTo: '{{messageSender.email}}',
      subject:
        '{{messageSender.displayName}} sent a message to your community!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          User {{messageSender.displayName}} sent a message to the <a href={{journey.url}}>'{{journey.displayName}}'</a> community where you are a lead:
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
