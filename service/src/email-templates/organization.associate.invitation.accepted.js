// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.associate.invitation.accepted',
  title: '{{actor.name}} accepted the invitation to associate with {{organization.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{actor.name}} accepted the invitation to associate with {{organization.name}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{actor.profile}}">{{actor.name}}</a> accepted the invitation to associate with <a href="{{organization.url}}">{{organization.name}}</a>.
          {% if rolesWithheld.length %}<br><br>
          {% for role in rolesWithheld %}The {{role}} role could not be granted because the limit was reached.<br>{% endfor %}
          {% endif %}
          <br><br>
          <a class="action-button" href="{{organizationAssociatesUrl}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
