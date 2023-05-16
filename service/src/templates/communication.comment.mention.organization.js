// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.comment.mention.organization',
  title:
    '{{commentSender.displayName}} mentioned {{mentionedOrganization.displayName}} in a comment on Alkemio',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '{{commentSender.displayName}} mentioned {{mentionedOrganization.displayName}} in a comment on Alkemio',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},

          {{commentSender.displayName}} mentioned '{{mentionedOrganization.displayName}}' in a comment on <a href={{commentOrigin.url}}>'{{commentOrigin.displayName}}'</a>:
          ======
          {{comment}}
          ======
          You can click on the <a href={{commentOrigin.url}}>this link</a> to view the comment in context and respond.

          Sincerely yours,
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
