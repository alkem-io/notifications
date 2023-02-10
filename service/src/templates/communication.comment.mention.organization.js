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
        {% block content %}
          Hi {{recipient.firstName}},<br><br>

          {{commentSender.displayName}} mentioned {{mentionedOrganization.displayName}} in a comment on '<a href={{commentOrigin.url}}>{{commentOrigin.displayName}}</a>' <br>
          {{comment}}

          <br><br>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
