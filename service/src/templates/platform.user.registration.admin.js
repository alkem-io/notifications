// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-user-registration-admin',
  title: '[Alkemio] New user registration: {{registrant.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'New user registration on Alkemio: {{registrant.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
        {{registrant.displayName}} registered on Alkemio with the following email address: {{registrant.email}}.
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
        href="{{registrant.profile}}">Have a look at {{registrant.displayName}}'s profile</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
