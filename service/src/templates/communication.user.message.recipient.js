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
        {% block content %}Hi {{recipient.firstName}},<br><br>

          {{messageSender.displayName}} has sent you a message:
          <br>
          <i>{{message}}</i>
          <br>
          You can reply to this email to respond directly to {{messageSender.firstName}}. 
          Please keep in mind that this way, your email address will become visible. 
          If you prefer to communicate through Alkemio, click on the envelope icon on {{messageSender.displayName}}'s profile.
          <br><br>

        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
