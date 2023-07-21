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
      subject: '{{journey.displayName}}: New update shared',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{sender.firstName}}</b> shared a new update in <a style="color:#065F6B; text-decoration: none;" href="{{journey.url}}">{{journey.displayName}}</a>, of which you are an admin.
          <br><br>
          <a class="action-button" href="{{journey.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
