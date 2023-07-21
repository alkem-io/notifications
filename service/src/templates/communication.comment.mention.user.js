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

          <b>{{commentSender.displayName}}</b> mentioned you in a comment on <a style="color:#065F6B; text-decoration: none;" href={{commentOrigin.url}}>"{{commentOrigin.displayName}}"</a>:
          <br><br>
          <i>{{comment}}</i>
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
        href="{{commentOrigin.url}}">Have a look!</a><br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
