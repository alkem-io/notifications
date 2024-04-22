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
          <pre><i>{{message}}</i></pre>
          <br>
          You can reply to this email to communicate directly with {{messageSender.firstName}}. Please note that your email address will become visible to the recipient.
          <br><br>

        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
