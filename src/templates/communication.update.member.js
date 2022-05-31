// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-member',
  title: '[{{community.name}}] New update shared',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[{{community.name}}] New update shared',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          A new update was shared by {{sender.firstname}} with your community. <br>
          To view the update please navigate to <a href="{{community.url}}">{{community.name}}</a>.<br><br>

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
