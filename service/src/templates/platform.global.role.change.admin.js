// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-global-role-change-admin',
  title: '[Alkemio] Global role change: {{user.name}} {{type}} {{role}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Global role change on Alkemio: {{user.displayName}} {{type}} {{role}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
        {{user.displayName}} with the following email address: {{user.email}} - {{type}} - {{role}}.
          <br><br>
          <a class="action-button" href="{{user.profile}}">Have a look at {{user.displayName}}'s profile</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
