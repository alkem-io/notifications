// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-admin-user-email-change',
  title: '[Alkemio] User email change: {{subjectName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{% if triggerOutcome === "DRIFT_DETECTED" %}Action required: {% endif %}Email change on Alkemio: {{subjectName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi{% if recipient.firstName %} {{recipient.firstName}}{% endif %},<br><br>
        {% if triggerOutcome === 'DRIFT_DETECTED' %}A user's login email address was changed, but a data drift was detected during the change. This change requires reconciliation — please review the affected account.{% else %}A user's login email address was changed on Alkemio.{% endif %}
        <br><br>
        User: {{subjectName}}<br>
        Previous email: {{oldEmail}}<br>
        New email: {{newEmail}}<br>
        Changed on: {{changedAt}}<br>
        Initiated by: {{initiatorName}}{% if isSelfInitiated %} (the user themselves){% endif %}<br>
        {% if approver %}Authorized by: {{approver.name}} ({{approver.role}}{% if approver.organization %}, {{approver.organization}}{% endif %})<br>{% endif %}
        {% if reason %}Reason: {{reason}}<br>{% endif %}
        <br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
