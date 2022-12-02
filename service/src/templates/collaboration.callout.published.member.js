// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-callout-published-member',
  title:
    '{{community.name}} - New callout is published: "{{callout.displayName}}", have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{community.name}} - New callout is published "{{callout.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},
          <br><br>
          A new callout was published by {{publishedBy.firstName}} on your community '<a href="{{community.url}}">{{community.name}}</a>': {{callout.displayName}}.
          <br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});