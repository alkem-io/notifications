// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-post-created-admin',
  title:
    '[{{journey.displayName}}] New Post created by {{createdBy.firstName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}}: New Post created by {{createdBy.firstName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{createdBy.firstName}}</b> created a new post: "<a style="color:#065F6B; text-decoration: none;" href={{post.url}}>{{post.displayName}}</a>" in {{journey.displayName}}, of which you are an admin.
        <br><br>
        <a class="action-button" href="{{post.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
