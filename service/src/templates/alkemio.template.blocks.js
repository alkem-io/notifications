module.exports = {
  footerBlock: `{% block footer %}
{% if recipient.notificationPreferences !== '' %}
  <a
  style="
    color: #a9a9a9;
    text-decoration: underline;
    font-family: Montserrat;
    padding: 15px 5px;
  "
  href="{{recipient.notificationPreferences}}"
  alt="Notification settings"
  >Would you like to change your notification preferences? Change the settings here.</a>
  &nbsp;
{% endif %}
{% endblock %}`,
};
