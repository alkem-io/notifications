// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-forum-discussion-comment',
  title: 'New comment on your discussion {{discussion.displayName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'New comment on discussion: {{discussion.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          A new comment has been added to <a style="color:#1d384a; text-decoration: none;" href="{{discussion.url}}">{{discussion.displayName}}</a>, the discussion you created in the Alkemio Forum
          <br><br>
          <a class="action-button" href="{{discussion.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
