// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.collaboration.callout.contribution',
  title:
    '{{space.displayName}} - New {{contribution.type}} contribution created by {{createdBy.firstName}}, have a look!',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}}: New {{contribution.type}} contribution created by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{createdBy.firstName}}</b> created a new {{contribution.type}} contribution: "<a style="color:#1d384a; text-decoration: none;" href="{{contribution.url}}">{{contribution.displayName}}</a>".
        <br><br>
        <a class="action-button" href="{{contribution.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
