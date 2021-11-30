/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-admin',
  title: 'New update sent to community {{community.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{user.email}}',
      subject: 'New update shared with community {{community.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.firstname}},<br><br>

          A new update was shared with your community. <br>
          To view the update please navigate to <a href="{{community.url}}">{{community.displayName}}</a>.<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});