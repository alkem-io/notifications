// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-interest-admin',
  title:
    '[{{journey.displayName}}] Interest to collaborate received from {{user.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{journey.displayName}}] Interest to collaborate received from {{user.name}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          The user '{{user.name}}' is interested to participate in '<a href="{{journey.url}}">{{journey.displayName}}</a>' [{{journey.type}}]:
          <br/>
          - role: {{relation.role}}<br/>
          - description: {{relation.description}}<br/>
          <br/>
          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
