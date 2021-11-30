/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-registration-admin',
  title: 'New user registration {{user.firstname}} {{user.lastname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{user.email}}',
      subject: 'New user registration: {{payload.name}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.firstname}},<br><br>

          There is a new user registration: {{payload.name}}, with email {{payload.email}}<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
