// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'aspect-created-member',
  title: '{{community.name}} - New comment received on your Card "{{aspect.displayName}}"',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{community.name}} - New comment received on your Card "{{aspect.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          A new comment was created by {{createdBy.firstname}} on your Card <a href={{aspect.url}}>{{aspect.displayName}}</a> within the Callout "{{callout.displayName}}".<br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
