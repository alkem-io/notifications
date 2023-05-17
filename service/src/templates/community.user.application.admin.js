// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-user-application-admin',
  title: '[{{journey.displayName}}] Application from {{applicant.firstName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{journey.displayName}}] Application from {{applicant.firstName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.name}},

          We have received an application from {{applicant.name}} for <a href="{{journey.url}}">{{journey.displayName}}</a> [{{journey.type}}].

          The profile of the new applicant is available <a href="{{applicant.profile}}" >here</a>.

          The application can be reviewed at the following Community administration page: <a href="{{journeyAdminURL}}" >here</a>.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
