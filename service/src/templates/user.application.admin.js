// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-admin',
  title:
    '[{{community.name}}] Application from {{applicant.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{community.name}}] Application from {{applicant.firstname}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.name}},<br><br>
          We have received an application from {{applicant.name}} for <a href="{{community.url}}">{{community.name}}</a> [{{community.type}}].<br><br>
          The profile of the new applicant is available <a href="{{applicant.profile}}" >here</a>.<br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
