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
        '{{journey.displayName}}: Application from {{applicant.firstName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.name}},<br><br>

          We have received an application from <b>{{applicant.name}}</b> for the {{journey.type}} <a style="color:#065F6B; text-decoration: none;" href="{{journey.url}}">{{journey.displayName}}</a>, of which you are an admin.
          <br><br>
          <a class="action-button" href="{{member.profile}}">Have a look at {{applicant.firstName}}'s profile</a><br><br>

          Review {{applicant.firstName}}'s application on the <a style="color:#065F6B;" href="{{journeyAdminURL}}" >Community tab on the settings page here</a>.

          <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
