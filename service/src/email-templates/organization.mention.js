// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'organization.mention',
  title:
    '{{commentSender.displayName}} mentioned {{mentionedOrganization.displayName}} in a comment on Alkemio',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{commentSender.displayName}} mentioned {{mentionedOrganization.displayName}} in a comment on Alkemio',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{commentSender.displayName}}</b> mentioned '{{mentionedOrganization.displayName}}' in a comment on <a style="color:#1d384a; text-decoration: none;" href={{commentOrigin.url}}>'{{commentOrigin.displayName}}'</a>:
          <br>
          <pre><i>{{comment}}</i></pre>
          <br>
          <a class="action-button" href="{{commentOrigin.url}}">HAVE A LOOK!</a><br><br>

        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
