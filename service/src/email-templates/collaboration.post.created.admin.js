// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-post-created-admin',
  title: '[{{space.displayName}}] New Post created by {{createdBy.firstName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}}: New Post created by {{createdBy.firstName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{createdBy.firstName}}</b> created a new post: "<a style="color:#1d384a; text-decoration: none;" href={{post.url}}>{{post.displayName}}</a>" in {{space.displayName}}, of which you are an admin.
        <br><br>
        <a class="action-button" href="{{post.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
