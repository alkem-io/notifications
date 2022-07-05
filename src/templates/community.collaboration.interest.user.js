// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-collaboration-interest-user',
  // title: "Application to join '{{community.name}}' received",
  title: "New user interest to participate in '{{opportunity.name}}'",
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        'Your interest to collaborate in {{opportunity.name}} was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.name}},<br><br>
          Thank you for expressing the interest to collaborate on {{opportunity.name}}.
          <br>
          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
