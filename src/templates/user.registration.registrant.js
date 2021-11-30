/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-registration-registrant',
  title: 'Welcome {{user.firstname}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{payload.email}}',
      subject: 'Alkemio registration successful!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{payload.name}},<br><br>

          Welcome to the Alkemio platform!<br><br>

          Your user profile has been successfully created!
          <br><br>
          Please spend some time to further populate your <a href="{{uri.user}}" >profile </a> so that other users / organizations can find you.
          <br><br>
          And please look at the Challenges on the platform to see what interests you! Then apply to join one or more communities :)
          <br>
          Looking forward to seeing your interactions and contributions!

          Sincerely yours,
          Team Alkemio
        {% endblock %}`,
    },
  },
});
