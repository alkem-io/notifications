// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-space-community-application-submitted',
  title: '{{space.displayName}} - Your Application to join was received!',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{space.displayName}} - Your Application to join was received!',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{applicant.name}},<br><br>
          We have received your application for the {{space.type}} <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.

          Once your application is accepted, you will find this {{space.type}} on your <a href="{{applicant.profile}}">profile</a> and homepage. As long as your application is pending, you can find it under "Pending Memberships" in your platform menu.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
