// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user.organization.associate.application.declined',
  title: 'Your application to associate with {{organization.name}} was declined',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Your application to associate with {{organization.name}} was declined',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          Your application to associate with <a href="{{organization.url}}">{{organization.name}}</a> was declined.
          <br><br>
          <a class="action-button" href="{{organizationUrl}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
