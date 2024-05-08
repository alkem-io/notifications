// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-external-invitation-created-inviter',
  title: '[{{space.displayName}}] Invitation sent',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{inviter.name}},<br><br>
          You have invited {{emails}} to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          {% if welcomeMessage %}
          <br>
          <pre><i>{{welcomeMessage}}</i></pre>
          {% endif %}
          <br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
