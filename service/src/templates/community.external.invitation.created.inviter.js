// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-external-invitation-created-inviter',
  title: '[{{journey.displayName}}] Invitation sent',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{journey.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{inviter.name}},

          You have invited {{emails}} to join <a href="{{journey.url}}">{{journey.displayName}}</a>.
          {% if welcomeMessage %}
          You have sent him this message:
          {{welcomeMessage}}

          {% endif %}
          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
