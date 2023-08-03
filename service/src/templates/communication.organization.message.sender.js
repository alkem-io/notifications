// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.organization.message.sender',
  title: 'You have sent a message to {{organization.displayName}}!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'You have sent a message to {{organization.displayName}}!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          You have sent the following message to <b>{{organization.displayName}}</b>:
          <br><br>
          <i>{{message}}</i>
          <br><br>

        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
