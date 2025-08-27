// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.communication.update.member',
  title: '{{space.displayName}} - New update, have a look!',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: '{{space.displayName}} - New update, have a look!',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{sender.firstName}}</b> shared a new update in <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a>.
          <div>{{message | safe}}</div>
          <div>
            <a class="action-button" href="{{space.url}}">HAVE A LOOK!</a>
          </div>
          <em style="font-size: 13px;">Some content may not display fully in this email. Click above to see everything.</em>
        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
