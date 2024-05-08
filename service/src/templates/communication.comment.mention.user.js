// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.comment.mention.user',
  title: '{{commentSender.displayName}} mentioned you in a comment on Alkemio',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      replyTo: '{{commentSender.email}}',
      subject:
        '{{commentSender.displayName}} mentioned you in a comment on Alkemio',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{commentSender.displayName}}</b> mentioned you in a comment on <a style="color:#1d384a; text-decoration: none;" href={{commentOrigin.url}}>"{{commentOrigin.displayName}}"</a>:
          <br>
          <pre><i>{{comment}}</i></pre>
          <br>
          <a class="action-button" href="{{commentOrigin.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
