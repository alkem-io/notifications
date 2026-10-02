// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user.organization.associate.invitation.platform.received',
  title: 'You are invited to join {{organization.name}} on Alkemio',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'You are invited to join {{organization.name}} on Alkemio',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{inviter.profile}}">{{inviter.name}}</a> has invited you to join <a href="{{organization.url}}">{{organization.name}}</a> on Alkemio as {{offeredRole}}.
          <br>
          <pre><i>{{welcomeMessage}}</i></pre>
          <br>
          <a class="action-button" href="{{invitationsURL}}">Sign up to respond</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
