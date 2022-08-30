// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-collaboration-interest-admin',
  title: 'Interest to collaborate on opportunity received',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{user.name}} is interested to collaborate on opportunity: {{opportunity.name}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          The user '{{user.name}}' is interested to participate in '{{opportunity.name}}' opportunity:
          <br/>
          - role: {{relation.role}}<br/>
          - description: {{relation.description}}<br/>
          <br/>
          <br/>
          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
