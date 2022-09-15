// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-new-member-admin',
  title: '[{{community.name}}] User {{member.name}} joined the community',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[{{community.name}}] User {{member.name}} joined the community',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},
          <br><br>
          User {{member.name}} has joined the {{community.name}} community.
          <br/>
          The profile of the new member is available <a href="{{member.profile}}" >here</a>.
          <br/>
          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
