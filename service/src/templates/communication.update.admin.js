// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-admin',
  title: '[{{journey.displayName}}] New update shared',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[{{journey.displayName}}] New update shared',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          A new update was shared by {{sender.firstName}} on community: <a href="{{journey.url}}">{{journey.displayName}}</a>.<br><br>

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
