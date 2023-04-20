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
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          {{commentSender.displayName}} mentioned you in a comment on <a href={{commentOrigin.url}}>'{{commentOrigin.displayName}}'</a>
          <br><br>======<br>
          {{comment}}
          <br>======<br><br>
          You can click on the <a href={{commentOrigin.url}}>this link</a> to view the comment in context and respond.
          <br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});