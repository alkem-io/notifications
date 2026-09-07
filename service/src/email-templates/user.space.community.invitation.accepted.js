// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user.space.community.invitation.accepted',
  title: '{{invitee.name}} accepted your invitation',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{invitee.name}} accepted your invitation',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{invitee.profile}}">{{invitee.name}}</a> accepted your invitation to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          <br><br>
          <a class="action-button" href="{{spaceCommunitySettingsURL}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
