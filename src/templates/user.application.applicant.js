/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-applicant',
  title: 'Welcome {{user.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{payload.email}}',
      subject: 'Your application to {{community.name}} was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{payload.name}},<br><br>
          We have received your application for {{community.name}} [{{community.type}}]!<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
