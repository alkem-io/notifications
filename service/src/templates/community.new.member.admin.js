// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-new-member-admin',
  title: '{{member.name}} joined {{journey.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{member.name}} joined {{journey.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{member.name}}</b> has joined <a style="color:#065F6B; text-decoration: none;" href="{{journey.url}}">{{journey.displayName}}</a>, of which you are an admin.
          <br><br>
          <a 
          style="
          background-color: #065F6B;
          border: none;
          border-radius: 12px;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 12px;
          margin: 4px 2px;
          cursor: pointer;
          "
        href="{{member.profile}}">Have a look at {{member.name}}'s profile</a><br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
