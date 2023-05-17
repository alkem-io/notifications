// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-forum-discussion-comment',
  title: 'New comment on your discussion {{discussion.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'New comment on discussion: {{discussion.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          A new comment has been added to the discussion you created, check it out here  <a href="{{discussion.url}}">{{discussion.displayName}}</a>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
