// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-sign-up-welcome',
  title: 'Alkemio Welcome {{recipient.firstName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Alkemio - Registration successful!',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}
    <p>Dear {{registrant.firstName}},</p>
    <p>Welcome aboard the Alkemio platform! Your account creation was a success — congratulations! 🎉 Perhaps you have already explored the platform, but let’s ensure you are fully equipped to dive in with the links below.</p><br>
        <p>🌐 <a style="color:#000000; text-decoration: none;" href="https://alkem.io/home"><b>Find Spaces</b>: At Alkemio, users collaborate within Spaces. If you are looking for a particular Space, use the search functionality on your Dashboard</a>.</p>
        <p>🚀 <a style="color:#000000; text-decoration: none;" href="https://alkem.io/welcome-space"><b>Explore the possibilities</b>: Take a peek at our Welcome Space — it’s an open Space for you to explore the platform's structure and functionality.</a></p>
        <p>📸 <a style="color:#000000; text-decoration: none;" href="{{registrant.profile}}"><b>Personalize Your Profile</b>: Add a friendly photo to your profile so fellow users can put a face to your name.</a></p>
        <p>💌 <a style="color:#000000; text-decoration: none;" href="mailto:community@alkem.io"><b>Need Assistance?</b>: Whether you’re keen on starting your own Space or require support, our Community team is here for you. Reach out anytime at <b>community@alkem.io</b></a>.</p>
        <p><a style="color:#000000; text-decoration: none;" href="https://welcome.alkem.io">❔ <b>Learn More</b>: For additional details about Alkemio, check out our website</a>.</p>
        <br>
    <p>We are looking forward to seeing your interactions and contributions!</p>
    <p>Warm regards,</p>
    <p>The Alkemio Team 🌟</p>
    <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
