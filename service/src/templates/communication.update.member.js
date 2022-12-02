// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-member',
  title: '{{journey.displayName}} - New update, have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '{{journey.displayName}} - New update, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          A new update was shared by {{sender.firstname}} on your community <a href="{{journey.url}}">{{journey.displayName}}</a>.<br><br>

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
