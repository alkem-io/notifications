/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-admin',
  title: 'Application from {{applicant.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        'Application from {{recipient.name}} to {{community.name}} received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>
          We have received an application from {{applicant.name}} for {{community.name}} [{{community.type}}].<br><br>
          The profile of the new applicant is available <a href="{{registrant.profile}}" >here</a>.<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
