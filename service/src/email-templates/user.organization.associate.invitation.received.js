// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user.organization.associate.invitation.received',
  title: 'You are invited to associate with {{organization.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'You are invited to associate with {{organization.name}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{inviter.profile}}">{{inviter.name}}</a> has invited you to associate with <a href="{{organization.url}}">{{organization.name}}</a> as {{offeredRole}}.
          <br>
          <pre><i>{{welcomeMessage}}</i></pre>
          <br>
          <a class="action-button" href="{{organizationUrl}}">Respond to the invitation</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
