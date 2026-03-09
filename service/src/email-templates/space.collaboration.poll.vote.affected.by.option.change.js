// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.collaboration.poll.vote.affected.by.option.change',
  title: '{{space.displayName}}: Your vote on "{{poll.title}}" was affected',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{space.displayName}}: Your vote on "{{poll.title}}" was affected',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
          Your vote on the poll <b>"{{poll.title}}"</b> in <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a> was affected by a change to the poll options. You may need to re-vote.
          <br><br>
          <a class="action-button" href="{{poll.url}}">Review and re-vote</a>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
