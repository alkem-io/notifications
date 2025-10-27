// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user.space.community.application.declined',
  title: '[{{space.displayName}}] {{decliner.name}} declined your application',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{decliner.name}} declined your application for {{space.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br>
          <a href="{{decliner.profile}}">{{decliner.firstName}}</a> declined your application for {{space.displayName}}.
          <br><br>
          <a class="action-button" href="{{spaceURL}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});