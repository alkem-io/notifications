// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-callout-published-member',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New {{callout.type}} is published "{{callout.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
          {% block content %}
          Hi {{recipient.firstName}}, <br><br>
          <b>{{publishedBy.firstName}}</b> published a new {{callout.type}} in {{journey.type}}: "{{journey.displayName}}", with name: "<a style="color:#1d384a; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>".
          <br><br>
          <a class="action-button" href="{{callout.url}}">HAVE A LOOK!</a>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
