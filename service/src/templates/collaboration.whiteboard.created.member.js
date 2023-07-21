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
        '{{journey.displayName}} - New Whiteboard created by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{createdBy.firstName}}</b> created a new whiteboard: "<a style="color:#065F6B; text-decoration: none;" href={{whiteboard.url}}>{{whiteboard.displayName}}</a>".
        <br><br>
        <a 
        style="
        background-color: #065F6B;
        border: none;
        border-radius: 12px;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 12px;
        margin: 4px 2px;
        cursor: pointer;
        "
      href="{{whiteboard.url}}">Have a look!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
