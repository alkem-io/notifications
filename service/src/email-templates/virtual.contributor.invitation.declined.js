// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'virtual.contributor.invitation.declined',
  title: '[{{space.displayName}}] {{decliner.name}} declined Virtual Contributor invitation',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{decliner.name}} declined your invitation',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br>
          <a href="{{decliner.profile}}">{{decliner.firstName}}</a> declined your invitation of their Virtual Contributor <a href="{{virtualContributor.url}}">{{virtualContributor.name}}</a> to join <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          <br><br>
          <a class="action-button" href="{{spaceURL}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});