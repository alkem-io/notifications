// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-email-change-new-address',
  title: '[Alkemio] Your login email address was updated',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Your Alkemio login email address was updated',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi{% if recipient.firstName %} {{recipient.firstName}}{% endif %},<br><br>
        This email address ({{newEmailFull}}) is now the login email for your Alkemio account, effective {{changedAt}}.
        <br><br>
        This change was made by {% if initiatorRole === 'self' %}you{% else %}a platform administrator{% endif %}.
        <br><br>
        <a class="action-button" href="{{loginUrl}}">Log in to Alkemio</a>
        <br><br>
        If you did not expect this change, please contact Alkemio support so we can help you secure your account.
        <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
