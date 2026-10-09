// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.admin.collaboration.callout.form.response',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{space.displayName}} - New Form response to "{{callout.displayName}}"',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>
        <b>{{submitter.displayName}}</b> responded to the Form "<a style="color:#1d384a; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>" in {{space.displayName}}.
        <br><br>
        <a class="action-button" href="{{callout.url}}">HAVE A LOOK!</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
