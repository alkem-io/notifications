/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-member',
  title: 'New update sent to community {{community.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'New update shared with community {{community.name}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          A new update was shared by {{sender.firstname}} with your community. <br>
          To view the update please navigate to <a href="{{community.url}}">{{community.name}}</a>.<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
