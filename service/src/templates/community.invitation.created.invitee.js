// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-invitation-created-invitee',
  title: '[{{space.displayName}}] Invitation from {{inviter.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br>
          <a href="{{inviter.profile}}">{{inviter.firstName}}</a> has invited you to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          <br>
          <pre><i>{{welcomeMessage}}</i></pre>
          <br>
          <a class="action-button" href="{{platform.invitationsURL}}">click here to accept or decline</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
