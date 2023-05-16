// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-discussion-comment-member',
  title:
    '{{journey.displayName}} - New comment received on Callout: "{{callout.displayName}}"',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New comment received on Callout "{{callout.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          A new comment was created by {{createdBy.firstName}} on your '<a href={{callout.url}}>{{callout.displayName}}</a>' Callout.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
