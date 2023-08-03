// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'platform-user-registration-registrant',
  title: 'Alkemio Welcome {{recipient.firstName}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Alkemio - Registration successful!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{registrant.firstName}}, welcome to the Alkemio platform! <br>
        <br>
          Your account has been successfully created. Please spend some time to further populate your <a style="color:#065F6B; text-decoration: none;" href="{{registrant.profile}}" >profile</a> so that other users and organizations can find you.
          <br><br>
          <a class="action-button" href="{{registrant.profile}}">YOUR PROFILE</a><br><br>
          On the <a style="color:#065F6B; text-decoration: none;" href="https://alkem.io/home">Homepage</a> and <a style="color:#065F6B; text-decoration: none;" href="https://alkem.io/challenges">Challenges page</a> you'll find all available Spaces and Challenges for you to join. 
          <br>
          Looking forward to seeing your interactions and contributions!<br><br>

          Sincerely yours,<br><br>

          The Alkemio team
          <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
