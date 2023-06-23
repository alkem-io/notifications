// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-post-created-member',
  title:
    '{{journey.displayName}} - New Post created by {{createdBy.firstName}}, have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New Post created by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          A new Post was created by {{createdBy.firstName}} with name '<a href={{post.url}}>{{post.displayName}}</a>'

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
