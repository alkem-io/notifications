/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-discussion-created-member',
  title: 'New discussion created on {{community.displayName}}: {{discussion.title}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{user.email}}',
      subject: 'New discussion created on {{community.displayName}}: {{discussion.title}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.firstname}},<br><br>

          A new discussion was created on your community <a href="{{community.url}}">{{community.displayName}}</a>: {{discussion.title}}<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
