/* eslint-disable quotes */
module.exports = () => ({
  name: 'welcome',
  title: 'Welcome {{user.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{user.email}}',
      subject: 'Welcome {{user.firstname}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{user.firstname}},<br><br>
          We're very happy to welcome you on board.<br><br>
          See you soon!
        {% endblock %}`,
    },
  },
  sampleData: {
    emailFrom: '"Alkem.io team" <info@alkem.io>',
    user: {
      firstname: 'Valentin',
      email: 'valentin@alkem.io',
    },
  },
});
