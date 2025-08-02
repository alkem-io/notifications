// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-global-role-change-admin',
  title: '[Alkemio] Global role change: {{user.name}} - {{type}} - {{role}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Global role change on Alkemio: {{user.displayName}} - {{type}} - {{role}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
        {{user.displayName}} with the following email address: {{user.email}} - {{type}} - {{role}}.
        <br><br>
        Action carried out by: {{actor.displayName}}.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
