// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'aspect-created-admin',
  title: '[{{community.name}}] New Card created by {{createdBy.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{community.name}}] New Card created by {{createdBy.firstname}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},
          <br><br>

          A new Card was created by {{createdBy.firstname}} on your community '<a href="{{community.url}}">{{community.name}}</a>': {{aspect.displayName}}.
          <br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
