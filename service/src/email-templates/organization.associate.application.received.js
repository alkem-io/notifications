// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.associate.application.received',
  title: '{{actor.name}} applied to associate with {{organization.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{actor.name}} applied to associate with {{organization.name}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          {% if isSupportEscalation %}<b>This organisation currently has no administrators.</b><br><br>{% endif %}
          <a href="{{actor.profile}}">{{actor.name}}</a> applied to associate with <a href="{{organization.url}}">{{organization.name}}</a>.
          <br>
          <pre><i>{{applicationMessage}}</i></pre>
          <br>
          <a class="action-button" href="{{organizationAssociatesUrl}}">Review the application</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
