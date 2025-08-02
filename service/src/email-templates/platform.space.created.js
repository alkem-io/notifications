// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-space-created',
  title: '',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'New space created - {{space.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{sender.name}}</b> created a new space "<a style="color:#1d384a; text-decoration: none;" href={{space.url}}>{{space.displayName}}</a>" on {{dateCreated}} UTC.
        <br><br>
        <a class="action-button" href="{{space.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});

