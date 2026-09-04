// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.space.community.invitation.declined',
  title: '{{organization.name}} declined your invitation',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{organization.name}} declined your invitation',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{actor.profile}}">{{actor.firstName}}</a> declined your invitation of <a href="{{organization.url}}">{{organization.name}}</a> to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          <br><br>
          <a class="action-button" href="{{spaceCommunitySettingsURL}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
