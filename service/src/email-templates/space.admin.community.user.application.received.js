// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.admin.community.user.application.received',
  title: '[{{space.displayName}}] Application from {{applicant.firstName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}}: Application from {{applicant.firstName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          We have received an application from <b>{{applicant.name}}</b> for the {{space.type}} <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>, of which you are an admin.
          <br>
          <a class="action-button" href="{{spaceAdminURL}}">Review {{applicant.firstName}}'s application</a><br><br>
          Have a look at {{applicant.firstName}}'s profile <a style="color:#1d384a;" href="{{applicant.profile}}" >here</a>.
          <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
