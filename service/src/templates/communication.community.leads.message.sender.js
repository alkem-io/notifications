// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.community.leads.message.sender',
  title: 'You have sent a message to community!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'You have sent a message to {{journey.displayName}} community!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          You have sent a message to <a href={{journey.url}}>'{{journey.displayName}}'</a> community leads:
          ======
          {{message}}
          ======

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
