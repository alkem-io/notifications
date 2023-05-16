// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-callout-published-member',
  title:
    '{{journey.displayName}} - New callout is published: "{{callout.displayName}}", have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New callout is published "{{callout.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          A new callout was published by {{publishedBy.firstName}} with name: '<a href={{callout.url}}>{{callout.displayName}}</a>'.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
