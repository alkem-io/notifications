// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-forum-discussion-comment',
  title: 'New comment on your discussion {{discussion.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'New comment on discussion: {{discussion.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          A new comment has been added to <a style="color:#065F6B; text-decoration: none;" href="{{discussion.url}}">{{discussion.displayName}}</a>, the discussion you created in the Alkemio Forum
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
        href="{{discussion.url}}">HAVE A LOOK!</a><br><br>

        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
