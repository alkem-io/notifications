// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-whiteboard-created-member',
  title:
    '{{journey.displayName}} - New Whiteboard created by {{createdBy.firstName}}, have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}}: New Whiteboard created by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{createdBy.firstName}}</b> created a new whiteboard: "<a style="color:#065F6B; text-decoration: none;" href={{whiteboard.url}}>{{whiteboard.displayName}}</a>".
        <br><br>
        <a class="action-button" href="{{whiteboard.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
