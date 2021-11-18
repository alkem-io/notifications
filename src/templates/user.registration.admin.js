/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-registration-admin',
  title: 'New user registration {{user.firstname}} {{user.lastname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{admin.email}}',
      subject: 'New user registration: {{user.name}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{admin.firstname}},<br><br>

          There is a new user registration: {{user.name}}, with email {{user.email}}<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
