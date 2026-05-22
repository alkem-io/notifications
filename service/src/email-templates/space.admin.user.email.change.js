// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.admin.user.email.change',
  title: '[{{space.displayName}}] Login email change: {{subjectName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}}: Login email change for {{subjectName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi{% if recipient.firstName %} {{recipient.firstName}}{% endif %},<br><br>
        You're an admin or lead of the {{space.type}} <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>. The login email of <b>{{subjectName}}</b>, a member there, was changed on Alkemio.
        <br><br>
        User: {{subjectName}}<br>
        Previous email: {{oldEmail}}<br>
        New email: {{newEmail}}<br>
        Changed on: {{changedAt}}<br>
        Initiated by: {{initiatorName}}{% if isSelfInitiated %} (the user themselves){% else %} (a platform administrator){% endif %}
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
