// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.community.leads.message.sender',
  title: 'You have sent a message to community!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'You have sent a message to {{journey.displayName}} community',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          You have sent the following message to the community lead(s) of <a style="color:#1d384a; text-decoration: none;" href={{journey.url}}>{{journey.displayName}}</a>:
          <br>
          <pre><i>{{message}}</i></pre>
          <br>
          
          {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
