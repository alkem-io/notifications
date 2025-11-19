// eslint-disable-next-line @typescript-eslint/no-var-requires
const templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.community.calendar.event.created',
  title: 'New {{calendarEvent.type}} scheduled in {{space.displayName}}',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject: 'New {{calendarEvent.type}} scheduled in {{space.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br>
          <a href="{{creator.profile}}">{{creator.name}}</a> scheduled a new {{calendarEvent.type}} in the <a style="color:#1d384a; text-decoration: none;" href="{{space.url}}">{{space.displayName}}</a> calendar:
          <br><br>
          <b>{{calendarEvent.title}}</b>
          <br><br>
          <a class="action-button" href="{{calendarEvent.url}}">Have a look</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});