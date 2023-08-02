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
          <b>{{publishedBy.firstName}}</b> published a new {{callout.type}} in {{journey.type}}: "{{journey.displayName}}", with name: "<a style="color:#065F6B; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>".
          <br><br>
          <a
          style="
          background-color: #065F6B;
          border: none;
          border-radius: 12px;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 12px;
          margin: 4px 2px;
          cursor: pointer;
          "
        href="{{callout.url}}">HAVE A LOOK!</a>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
