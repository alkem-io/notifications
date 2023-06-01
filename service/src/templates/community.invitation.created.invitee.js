// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-invitation-created-invitee',
  title: '[{{journey.displayName}}] Application from {{applicant.firstName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{journey.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.name}},

          We would like to invite you to join <a href="{{journey.url}}">{{journey.displayName}}</a>.

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
