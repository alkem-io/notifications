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
        {% block content %}Hi {{inviter.name}},<br><br>
          You have invited {{emails}} to join <a style="color:#065F6B; text-decoration: none;" href="{{journey.url}}">{{journey.displayName}}</a>.
          {% if welcomeMessage %}
          <br>
          <i>{{welcomeMessage}}</i>
          {% endif %}
          <br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
