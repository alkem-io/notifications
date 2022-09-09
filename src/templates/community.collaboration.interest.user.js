// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-collaboration-interest-user',
  title: 'Interest to collaborate on {community.name}} [{{community.type}}]',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Your interest to collaborate was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.name}},<br><br>
          Thank you for expressing the interest to collaborate on '<a href="{{community.url}}">{{community.name}}</a>' [{{community.type}}]!
          <br><br>
          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
