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
        {% block content %}Hi {{registrant.firstName}},

          Welcome to the Alkemio platform!

          Your user profile has been successfully created!

          Please spend some time to further populate your <a href="{{registrant.profile}}" >profile </a> so that other users / organizations can find you.

          And please look at the Challenges on the platform to see what interests you! Then apply to join one or more communities :)

          Looking forward to seeing your interactions and contributions!

          Sincerely yours,
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
