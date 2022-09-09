// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'aspect-created-admin',
  title: '[{{community.name}}] New Card created by {{createdBy.firstname}} in Callout "{{callout.displayName}}"',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        '[{{community.name}}] New Card created by {{createdBy.firstname}} in Callout "{{callout.displayName}}"',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          A new Card was created by {{createdBy.firstname}} within Callout "{{callout.displayName}}": <a href={{aspect.url}}>{{aspect.Displayname}}</a>.<br><br>

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
