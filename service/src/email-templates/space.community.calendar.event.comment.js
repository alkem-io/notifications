// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.community.calendar.event.comment',
  title: 'New comment on {{calendarEvent.type}}: {{calendarEvent.title}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'New comment on {{calendarEvent.type}}: {{calendarEvent.title}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br>
          <a href="{{commentor.profile}}">{{commentor.name}}</a> commented on <b>{{calendarEvent.title}}</b> in the <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a> calendar
          <br><br>
          <a class="action-button" href="{{calendarEvent.url}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
