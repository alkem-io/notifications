/* eslint-disable quotes */
module.exports = () => ({
  name: 'communication-discussion-created-admin',
  title: 'New discussion created on {{community.name}}: {{discussion.title}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject:
        'New discussion created on {{community.name}}: {{discussion.title}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{recipient.firstname}},<br><br>

          A new discussion was created by {{createdBy.firstname}} on <a href="{{community.url}}">{{community.name}}</a>: {{discussion.title}}<br><br>

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
