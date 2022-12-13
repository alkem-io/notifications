// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-user-application-applicant',
  title: '{{journey.displayName}} - Your Application to join was received!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '{{journey.displayName}} - Your Application to join was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{applicant.name}},<br><br>
          We have received your application for <a href="{{journey.url}}">{{journey.displayName}}</a> [{{journey.type}}]!<br><br>
          Please view the status of your application on your <a href="{{applicant.profile}}">profile</a>.<br><br>
          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
