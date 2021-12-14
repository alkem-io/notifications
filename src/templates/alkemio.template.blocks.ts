export const footerBlock = `{% block footer %}<a
  style="
    color: #068293;
    text-decoration: underline;
    font-family: Montserrat;
    padding: 15px 5px;
  "
  href="{{hub.url}}"
  alt="Link to our community"
  >Join our community</a
>
&nbsp;
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
<a
style="
  color: #068293;
  text-decoration: underline;
  font-family: Montserrat;
  padding: 15px 5px;
"
href="https://alkem.io/about/"
alt="About Alkemio"
>About</a
>
{% endblock %}`;
