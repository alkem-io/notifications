// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'community-platform-invitation-created-invitee',
  title: '[{{space.displayName}}] Invitation from {{inviter.name}}',
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Invitation to join {{space.displayName}}',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}    <p><a href="{{inviter.profile}}">{{inviter.firstName}}</a> has invited you to join <a href="{{space.url}}">{{space.displayName}}</a> on Alkemio.</p><br>
          {% if welcomeMessage %}
          <p>
          <pre><i>{{welcomeMessage}}</i></pre>
</p>
          {% endif %}
          <a class="action-button" href="{{space.url}}">click here to go to the (Sub)Space</a><br><br>
<strong>How to Get Started:</strong>
    <ol>
        <li><strong><a style="color:#000000; text-decoration: none;" href="{{space.url}}">🔗 Click the Link:</a></strong> Simply click on the link above to open the (Sub)Space you've been invited to. It will take you directly to the heart of our collaborative platform.</li>
        <li><strong>✏️ Create Your Account:</strong> Once there, you'll notice a prominent button inviting you to sign in to apply. Follow the steps to <b>create a new account</b>. Remember, this invitation is tied to the email address it was sent to, so use that same address during registration.</li>
        <li><strong>✅ Verify and Accept:</strong> After verifying your account and signing in, you'll land back in the (Sub)Space. Look for the button to accept the invitation. Click it to officially become part of the Space community.</li>
        <li><strong>🎉 You're In!</strong> Congratulations! You're now part of <a href="{{space.url}}">{{space.displayName}}</a>. Feel free to explore, connect with fellow members, and contribute to the discussions. If you ever feel lost during the process, don't worry—use the button in this email to return to the (Sub)Space you were invited to.</li>
    </ol>
    <p>We are looking forward to your valuable contributions!</p>

    <p>Warm regards,</p>
    <p>The Alkemio Team</p>
    <br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
