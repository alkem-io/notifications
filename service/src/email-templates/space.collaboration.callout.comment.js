// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space-collaboration-callout-comment',
  title:
    '{{space.displayName}} - New comment received on your {{callout.type}}: "{{callout.displayName}}"',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}} - New comment received on your {{callout.type}} "{{callout.displayName}}" by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{createdBy.firstName}}</b> commented on your {{callout.type}} titled: <a style="color:#1d384a; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>.
        <br><br>
        <a class="action-button" href="{{callout.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
