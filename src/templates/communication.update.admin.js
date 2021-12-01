/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-update-admin',
  title: 'New update sent to community {{community.displayName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'New update shared with community {{community.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          A new update was shared by {{update.sender.firstname} on the following community: <a href="{{community.url}}">{{community.displayName}}</a>.<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
