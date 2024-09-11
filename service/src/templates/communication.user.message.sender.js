// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.user.message.sender',
  title: 'You have sent a message to {{messageReceiver.displayName}}!',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'You have sent a message to {{messageReceiver.displayName}}!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          You have sent the following message to {{messageReceiver.displayName}}:
          <br>
          <pre><i>{{message}}</i></pre>
          <br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
