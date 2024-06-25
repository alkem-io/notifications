// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-invitation-created-vc-host',
  title: 'Invitation for Virtual Contributor to join {{space.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation for Virtual Contributor to join {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br>
          <a href="{{inviter.url}}">{{inviter.name}}</a> has invited your Virtual Contributor <a href="{{virtualContributor.url}}">{{virtualContributor.name}}</a> to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
