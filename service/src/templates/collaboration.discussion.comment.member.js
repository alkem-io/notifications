// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-discussion-comment-member',
  title:
    '{{journey.displayName}} - New comment received on Callout: "{{callout.displayName}}"',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{journey.displayName}} - New comment received on Callout "{{callout.displayName}}", have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{createdBy.firstName}}</b> commented on your {{callout.type}} '<a style="color:#065F6B; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>'.
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
        href="{{callout.url}}">HAVE A LOOK!</a><br><br>

        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
