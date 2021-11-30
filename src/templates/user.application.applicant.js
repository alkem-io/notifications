/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-applicant',
  title: "Application to join '{{community.name}}' received",
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Your application to {{community.name}} was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{applicant.name}},<br><br>
          We have received your application for {{community.name}} [{{community.type}}]!<br><br>
          Please view the status of your application on your <a href="{{registrant.profile}}" >profile</a>.<br><br>
          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
