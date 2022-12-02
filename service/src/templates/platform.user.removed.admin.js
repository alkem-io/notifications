// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-user-removed-admin',
  title: '[Alkemio] User deleted: {{registrant.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[Alkemio] User profile deleted: {{registrant.name}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          The following user has been removed: {{registrant.name}}, with email {{registrant.email}}<br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});