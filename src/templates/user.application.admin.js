/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-admin',
  title: 'Welcome {{user.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{user.email}}',
      subject:
        'Application from {{applicant.name}} to {{community.name}} received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.firstname}},<br><br>
          We have received an application from {{user.name}} for {{community.name}} [{{community.type}}] !<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
