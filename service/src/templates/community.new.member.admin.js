// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-new-member-admin',
  title: '[{{member.type}}] {{member.name}} joined {{space.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '[{{member.type}}] {{member.name}} joined {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          <b>{{member.name}}</b> [{{member.type}}] has joined <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>, of which you are an admin.
          <br><br>
          <a class="action-button" href="{{member.profile}}">Have a look at {{member.name}}'s profile</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
