// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication.community.leads.message.recipient',
  title: '{{messageSender.displayName}} sent a message to your community!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      replyTo: '{{messageSender.email}}',
      subject: '{{messageSender.displayName}} sent a message to your community',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

          <b>{{messageSender.displayName}}</b> sent a message to you in your role as a lead of <a style="color:#1d384a; text-decoration: none;" href={{journey.url}}>'{{journey.displayName}}'</a>:
          <br>
          <pre><i>{{message}}</i></pre>
          <br>
          You can reply to this email to respond directly to {{messageSender.firstName}}. 
          Please keep in mind that this way, your email address will become visible. 
          If you prefer to communicate through Alkemio, click on the envelope icon on {{messageSender.displayName}}'s profile.<br><br>

        {% endblock %}

        ${templates.footerBlock}`,
    },
  },
});
