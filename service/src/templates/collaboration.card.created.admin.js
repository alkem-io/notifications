// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-post-created-admin',
  title:
    '[{{journey.displayName}}] New Card created by {{createdBy.firstName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{journey.displayName}}] New Card created by {{createdBy.firstName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          A new Card was created by {{createdBy.firstName}} with name: '<a href={{post.url}}>{{post.displayName}}</a>'.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
