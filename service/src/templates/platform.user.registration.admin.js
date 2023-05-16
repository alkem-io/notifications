// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-user-registration-admin',
  title: '[Alkemio] New user registration: {{registrant.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[Alkemio] New user registration: {{registrant.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          There is a <a href="{{registrant.profile}}" >new user registration </a>: {{registrant.displayName}}, with email '{{registrant.email}}'.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
