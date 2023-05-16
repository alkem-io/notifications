// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-new-member-admin',
  title: '[{{journey.displayName}}] User {{member.name}} joined the community',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{journey.displayName}}] User {{member.name}} joined the community',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          User {{member.name}} has joined the {{journey.displayName}} community.

          The profile of the new member is available <a href="{{member.profile}}" >here</a>.

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
