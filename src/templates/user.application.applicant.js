// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-applicant',
  title: '[{{community.name}}] Application to join received',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[{{community.name}}] Application to join received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{applicant.name}},<br><br>
          We have received your application for <a href="{{community.url}}">{{community.name}}</a> [{{community.type}}]!<br><br>
          Please view the status of your application on your <a href="{{applicant.profile}}">profile</a>.<br><br>
          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
