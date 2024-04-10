// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'collaboration-interest-user',
  title: '{{journey.displayName}} - Your interest to collaborate was received!',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: '{{user.name}} - Your interest to collaborate was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{user.name}},<br><br>

          Thank you for expressing the interest to collaborate on '<a style="color:#1d384a; text-decoration: none;" href="{{journey.url}}">{{journey.displayName}}</a>' [{{journey.type}}]!
          <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
