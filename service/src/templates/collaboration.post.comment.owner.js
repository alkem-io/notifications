// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-post-comment-owner',
  title:
    '{{journey.displayName}} - New comment received on your Post: "{{post.displayName}}"',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New comment received on your Post "{{post.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{createdBy.firstName}}</b> commented on your post titled: <a style="color:#1d384a; text-decoration: none;" href={{post.url}}>{{post.displayName}}</a>.
          <br><br>
          <a class="action-button" href="{{post.url}}">HAVE A LOOK!</a><br><br>

        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
