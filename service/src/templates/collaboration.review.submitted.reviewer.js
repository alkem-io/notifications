// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-review-submitted-reviewer',
  title: '{{journey.displayName}} - You have submitted a review',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '{{journey.displayName}} - You have submitted a review',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          You have submitted a review about {{journey.displayName}}

          {review}

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
