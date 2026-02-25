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
          {% if calendarEvent.description %}
            <i>{{calendarEvent.description}}</i>
            <br><br>
          {% endif %}
          <b>When:</b> {{calendarEvent.formattedStartDate}}
          {% if calendarEvent.formattedEndDate %} - {{calendarEvent.formattedEndDate}}{% endif %}

          {% if calendarEvent.location %}<b>Where:</b> {{calendarEvent.location}}<br>{% endif %}
          <a class="action-button" href="{{calendarEvent.url}}">Have a look</a><br><br>

          <div style="border-top: 1px solid #ddd;">
            <p style="display: flex; flex-direction: row; align-items: flex-start; flex-wrap: nowrap; white-space: nowrap; gap: 10px;">Add to your calendar:
              <b><a href="{{calendarEvent.icsDownloadUrl}}">iCal File</a></b> |
              <b><a href="{{calendarEvent.appleCalendarUrl}}">Apple Calendar</a></b> |
              <b><a href="{{calendarEvent.googleCalendarUrl}}">Google Calendar</a></b> |
              <b><a href="{{calendarEvent.outlookCalendarUrl}}">Outlook</a></b>
            </p>
          </div>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});