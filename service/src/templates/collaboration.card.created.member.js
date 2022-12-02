// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-card-created-member',
  title:
    '{{journey.displayName}} - New Card created by {{createdBy.firstName}}, have a look!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New Card created by {{createdBy.firstName}}, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstName}},
          <br><br>
          A new Card was created by {{createdBy.firstName}} on your community '<a href="{{journey.url}}">{{journey.displayName}}</a>' with name '{{aspect.displayName}}'
          <br><br>
          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
