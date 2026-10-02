// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user.collaboration.callout.form.response.receipt',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}} - Your response to "{{callout.displayName}}" was received',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
        We received your response to "<a style="color:#1d384a; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>" in {{space.displayName}} on {{formResponse.submittedAt}}.
        <br><br>
        {{whoCanRead}}.
        <br><br>
        You can view or withdraw your response at any time.
        <br><br>
        <a class="action-button" href="{{callout.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
