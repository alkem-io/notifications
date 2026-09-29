// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.associate.invitation.declined',
  title: '{{actor.name}} declined the invitation to associate with {{organization.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{actor.name}} declined the invitation to associate with {{organization.name}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{actor.profile}}">{{actor.name}}</a> declined the invitation to associate with <a href="{{organization.url}}">{{organization.name}}</a>.
          <br><br>
          <a class="action-button" href="{{organizationAssociatesUrl}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
