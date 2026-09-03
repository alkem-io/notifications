// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.space.community.invitation.received',
  title: 'Invitation for {{organization.name}} to join {{space.displayName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Invitation for {{organization.name}} to join {{space.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{inviter.profile}}">{{inviter.firstName}}</a> has invited <a href="{{organization.url}}">{{organization.name}}</a> to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a> as {{offeredRole}}.
          {% if spacesToJoin.length > 1 %}
          <br>
          Accepting also joins: {% for entry in spacesToJoin %}<a href="{{entry.url}}">{{entry.displayName}}</a>{% if not loop.last %}, {% endif %}{% endfor %}.
          {% endif %}
          <br>
          <pre><i>{{welcomeMessage}}</i></pre>
          <br>
          <a class="action-button" href="{{organizationInvitationsUrl}}">Review the invitation</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
