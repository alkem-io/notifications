// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-platform-invitation-created-invitee',
  title: '[{{space.displayName}}] Invitation from {{inviter.name}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}    <p><a href="{{inviter.profile}}">{{inviter.firstName}}</a> has invited you to join <a href="{{space.url}}">{{space.displayName}}</a> on Alkemio.</p><br>
          {% if welcomeMessage %}
          <p>
          <pre><i>{{welcomeMessage}}</i></pre>
</p>
          {% endif %}
          <a class="action-button" href="{{space.url}}">click here to accept the invitation</a><br><br>
<strong>How to Get Started:</strong>
    <ol>
        <li><strong>Sign Up & Join:</strong> Click the button above to sign up to our platform and access your pending invitation 🔗</li> 
        <li><strong>Use This Email:</strong> When creating an account, make sure to use the same email address this invitation was sent to (<strong>{{recipient.email}}</strong>).</li> 
        <li><strong>Accept & Explore:</strong> Once you've created an account, you'll be able to accept the invitation and start exploring the space!</li>
    </ol>
    <p>We look forward to your contributions! 🎉 If the space is public, you can also <a href="{{space.url}}">explore it without signing in</a> by clicking on the Space title.</p>
    <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
