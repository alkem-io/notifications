// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-external-invitation-created-invitee',
  title: '[{{journey.displayName}}] Invitation from {{inviter.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{journey.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <a href="{{inviter.profile}}">{{inviter.firstName}}</a> has invited you to join <a href="{{journey.url}}">{{journey.displayName}}</a> on Alkemio.
          {% if welcomeMessage %}
          <br><br>
          <i>{{welcomeMessage}}</i>

          {% endif %}
          <br><br>
          <a class="action-button" href="">click here to accept or decline</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
