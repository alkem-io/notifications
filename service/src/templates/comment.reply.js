// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'comment-reply',
  title: 'You have a new reply on your comment',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'You have a new reply on your comment, have a look!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b><a href={{reply.createdByUrl}}>{{reply.createdBy}}</a></b> replied to your comment on "<a style="color:#065F6B; text-decoration: none;" href={{comment.commentUrl}}>{{comment.commentOrigin}}</a>":
        <br><br>
        <i>"{{reply.message}}"</i>

        <br><br>
        <a class="action-button" href="{{comment.commentUrl}}">HAVE A LOOK!</a><br><br>

        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
