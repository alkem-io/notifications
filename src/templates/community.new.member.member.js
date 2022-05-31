// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-new-member-member',
  title: '[{{community.name}}] You have joined this community',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{member.email}}',
      subject: '[{{community.name}}] You have joined this community',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          You have joined the {{community.name}} community
          <br/>
          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
