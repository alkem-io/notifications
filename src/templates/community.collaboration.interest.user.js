// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-collaboration-interest-user',
  title: '{{opportunity.name}} - Your interest to collaborate was received!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '{{opportunity.name}} - Your interest to collaborate was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.name}},<br><br>

          Thank you for expressing your interest to collaborate on Opportunity {{opportunity.name}}. The community needs all the help it can get!
          <br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
