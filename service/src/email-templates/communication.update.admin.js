// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-admin',
  title: '[{{space.displayName}}] New update shared',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{space.displayName}}: New update shared',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{sender.firstName}}</b> shared a new update in <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>, of which you are an admin.
          <br><br>
          <a class="action-button" href="{{space.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
