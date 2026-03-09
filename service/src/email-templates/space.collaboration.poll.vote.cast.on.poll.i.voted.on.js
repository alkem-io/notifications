// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.collaboration.poll.vote.cast.on.poll.i.voted.on',
  title: '{{space.displayName}}: {{voter.name}} also voted on "{{poll.title}}"',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{space.displayName}}: {{voter.name}} also voted on "{{poll.title}}"',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          <b>{{voter.name}}</b> voted on a poll you also voted on: <b>"{{poll.title}}"</b> in <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          <br><br>
          <a class="action-button" href="{{poll.url}}">View poll</a>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
