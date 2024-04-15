// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-external-invitation-created-invitee',
  title: '[{{space.displayName}}] Invitation from {{inviter.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}<a href="{{inviter.profile}}">{{inviter.firstName}}</a> has invited you to join <a href="{{space.url}}">{{space.displayName}}</a> on Alkemio.
          {% if welcomeMessage %}
          <br>
          <pre><i>{{welcomeMessage}}</i></pre>
          {% endif %}
          <br>
          <a class="action-button" href="{{space.url}}">click here to accept or decline</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
