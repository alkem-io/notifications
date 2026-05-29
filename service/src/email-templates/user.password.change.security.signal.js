// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-password-change-security-signal',
  title: '[Alkemio] Security alert: your password was changed',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Security alert: your Alkemio password was changed',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi{% if recipient.firstName %} {{recipient.firstName}}{% endif %},<br><br>
        The password for your Alkemio account was changed on {{changedAt}}.
        <br><br>
        If you made this change, there's nothing else you need to do.
        <br><br>
        If you did not change your password, your account may be compromised.
        Please reset your password immediately and contact Alkemio support so we can help you secure your account.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
