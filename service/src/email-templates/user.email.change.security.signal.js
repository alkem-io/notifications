// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-email-change-security-signal',
  title: '[Alkemio] Security alert: your login email was changed',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Security alert: your Alkemio login email was changed',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi{% if recipient.firstName %} {{recipient.firstName}}{% endif %},<br><br>
        The login email address for your Alkemio account was changed on {{changedAt}}.
        <br><br>
        This change was made by {% if initiatorRole === 'self' %}you{% else %}a platform administrator{% endif %}.
        <br><br>
        The new login email address is {{newEmailMasked}}.
        <br><br>
        If you did not expect this change, please contact Alkemio support straight away so we can help you secure your account.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
