// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-canvas-created-member',
  title:
    '{{journey.displayName}} - New Canvas created by {{createdBy.firstName}}, have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New Canvas created by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          A new Canvas was created by {{createdBy.firstName}} with name '<a href={{canvas.url}}>{{canvas.displayName}}</a>'

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
