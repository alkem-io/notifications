module.exports = {
  footerBlock: `{% block footer %}<a
  stylstylee="
    color: #068293;
    text-decoration: underline;
    font-family: Montserrat;
    padding: 15px 5px;
  "
  href="{{space.url}}"
  alt="Link to our community"
  >Join our community</a
>
&nbsp;
{% if recipient.notificationPreferences !== '' %}
  <a
  style="
    color: #068293;
    text-decoration: underline;
    font-family: Montserrat;
    padding: 15px 5px;
  "
  href="{{recipient.notificationPreferences}}"
  alt="User notification preferences"
  >Notification settings</a
  >
  &nbsp;
{% endif %}
<a
style="
  color: #068293;
  text-decoration: underline;
  font-family: Montserrat;
  padding: 15px 5px;
"
href="https://alkemio.foundation/"
alt="About Alkemio"
>About</a
>
{% endblock %}`,
};
