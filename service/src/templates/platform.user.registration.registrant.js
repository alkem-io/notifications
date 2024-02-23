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
        {% block content %}
            <h1>Dear {{registrant.firstName}},</h1>
    <p>Welcome aboard the Alkemio platform! 🚀 Your account creation was a success—congratulations! 🎉 You’ve likely already explored your Dashboard and some Spaces, but let’s ensure you’re fully equipped to dive in.</p>
    <ul>
        <li>🌐 <b>Explore Spaces</b>: Alkemio thrives on collaboration within Spaces. Use your Dashboard’s search functionality to discover Spaces that pique your interest.</li>
        <li>🚀 <b>Welcome Space</b>: Take a peek at our Welcome Space—it’s a treasure trove of tips and tricks waiting for you.</li>
        <li>📸 <b>Personalize Your Profile</b>: Add a friendly photo to your profile so fellow users can put a face to your name.</li>
        <li>💌 <b>Need Assistance?</b>: Whether you’re keen on starting your own Space or require support, our Community team is here for you. Reach out anytime at <a href="mailto:community@alkem.io"><b>community@alkem.io</b></a>.</li>
        <li>🌐 Learn More: For additional details about Alkemio, check out our <a href="https://www.alkem.io">website</a>.</li>
    </ul>
    <p>We’re looking forward to seeing your interactions and contributions! 🌈</p>
    <p>Warm regards,</p>
    <p>The Alkemio Team 🌟</p>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
