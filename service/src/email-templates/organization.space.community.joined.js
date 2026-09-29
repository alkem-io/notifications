// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.space.community.joined',
  title: '{{organization.name}} has joined {{space.displayName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{organization.name}} has joined {{space.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}{% if recipient.firstName %}Hi {{recipient.firstName}},{% else %}Hello,{% endif %}<br>
          <a href="{{organization.url}}">{{organization.name}}</a> is now a member of <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>{% if actor.name %}, after <a href="{{actor.profile}}">{{actor.name}}</a> accepted the invitation{% endif %}.
          <br>
          No further action is needed from you.
          <br><br>
          <a class="action-button" href="{{space.url}}">Visit the Space</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
