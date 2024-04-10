// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-new-member-member',
  title: '{{journey.displayName}} - You have joined this community',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{member.email}}',
      subject: '{{journey.displayName}} - Welcome to the Community!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          Thank you for joining <a style="color:#1d384a; text-decoration: none;" href="{{journey.url}}">{{journey.displayName}}</a>!
          You can now start contributing to the various posts and whiteboards, further deepen your knowledge about this topic, and connect with other Contributors.
          <br><br>
          <a class="action-button" href="{{journey.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
