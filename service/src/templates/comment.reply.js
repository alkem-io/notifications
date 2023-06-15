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
        {% block content %}Hi {{recipient.firstName}},

        <a href={{reply.createdByUrl}}>{{reply.createdBy}}</a> has replied to your comment on '<a href={{comment.commentUrl}}>{{comment.commentOrigin}}</a>':
          
        {{reply.message}}

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
