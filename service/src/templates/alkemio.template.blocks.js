module.exports = {
  footerBlock: `{% block footer %}
{% if recipient.notificationPreferences !== '' %}
  <span style="padding: 15px 0; color: #a9a9a9;">
  Would you like to change your notification preferences? Change the settings <a
  style="
    color: #a9a9a9;
    text-decoration: underline;
  "
  href="{{recipient.notificationPreferences}}"
  alt="Notification settings"
  >here</a>.
  </span>
{% endif %}
{% endblock %}`,
};
