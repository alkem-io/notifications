// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.user.message.sender',
  title: 'You have sent a message to {{messageReceiver.displayName}}!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'You have sent a message to {{messageReceiver.displayName}}!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          You have sent a message to user {{messageReceiver.displayName}}:
          ======
          {{message}}
          ======

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
