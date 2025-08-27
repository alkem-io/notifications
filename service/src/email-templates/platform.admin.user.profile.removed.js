// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-admin-user-profile-removed',
  title: '[Alkemio] User deleted: {{registrant.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        'User profile deleted from the Alkemio platform: {{registrant.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{registrant.displayName}}</b>, with email {{registrant.email}} has been removed as a user from the platform.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
