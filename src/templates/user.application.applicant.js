/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-applicant',
  title: 'Welcome {{user.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{applicant.email}}',
      subject: 'Your application from to {{community.name}} was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{applicant.name}},<br><br>
          We have received your application for {{community.name}} [{{community.type}}] !<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
  sampleData: {
    emailFrom: '<info@alkem.io>',
    applicant: {
      name: 'Neil Smyth',
      email: 'neil@alkem.io',
    },
    community: {
      name: '01 Save The Oceans',
      type: 'challenge',
    },
  },
});
