// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-second-factor-change-security-signal',
  title:
    '[Alkemio] Security alert: two-step verification on your account was changed',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        'Security alert: two-step verification on your Alkemio account was changed',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi{% if recipient.firstName %} {{recipient.firstName}}{% endif %},<br><br>
        Two-step verification on your Alkemio account was changed on {{changedAt}}.
        <br><br>
        If you did this, or asked Alkemio support to, there's nothing else you need to do.
        <br><br>
        If your password no longer works, use "Forgot your password?" on the sign-in page.
        <br><br>
        If you did not do this, your account may be compromised: please contact Alkemio support.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
