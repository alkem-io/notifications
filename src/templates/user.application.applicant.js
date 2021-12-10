/* eslint-disable quotes */
module.exports = () => ({
  name: 'user-application-applicant',
  title: "Application to join '{{community.name}}' received",
  version: 1,
  channels: {
    email: {
      from: '{{emailFrom}}',
      to: '{{recipient.email}}',
      subject: 'Your application to {{community.name}} was received!',
      html: `{% extends "src/templates/_layouts/email-transactional.html" %}
        {% block content %}
          Hi {{applicant.name}},<br><br>
          We have received your application for <a href="{{community.url}}">{{community.name}}</a> [{{community.type}}]!<br><br>
          Please view the status of your application on your <a href="{{applicant.profile}}">profile</a>.<br><br>
          Sincerely yours,
          Team Alkemio
        {% endblock %}

        {% block footer %}
        <td>
        <b>Team Alkemio</b>
        <br>
        <br>
        <a href="https://alkem.io">
          <img src="https://alkem.io/uploads/logos/alkemio-logo.png" width="175"> </a>

         We have received your application for <a href="{{community.url}}">{{community.name}}</a> [{{community.type}}]!<br><br>
         Website: <a style="color:#068293; font-weight:600; text-decoration:underline;" href="https://alkem.io">https://alkem.io</a>


        </td>
        {% endblock %}`,
    },
  },
});
