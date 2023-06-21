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
        {% block content %}Hi {{recipient.firstName}},

          A new comment was created by {{createdBy.firstName}} on your '<a href={{post.url}}>{{post.displayName}}</a>' Post.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
