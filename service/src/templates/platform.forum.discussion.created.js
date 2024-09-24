// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-forum-discussion-created',
  title: 'New discussion created: {{discussion.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'New discussion created: {{discussion.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          <b>{{createdBy.firstName}}</b> created a new post in the Alkemio Forum: "<a style="color:#1d384a; text-decoration: none;" href="{{discussion.url}}">{{discussion.displayName}}</a>"
          <br><br>
          <a class="action-button" href="{{discussion.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
