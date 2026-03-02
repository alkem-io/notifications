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
          <b>When:</b> {{calendarEvent.formattedStartDate}}{% if calendarEvent.formattedEndDate %} - {{calendarEvent.formattedEndDate}}{% endif %}<br>

          {% if calendarEvent.location %}<b>Where:</b> {{calendarEvent.location}}<br>{% endif %}
          <a class="action-button" href="{{calendarEvent.url}}">Have a look</a><br><br>

          <div style="border-top: 1px solid #ddd;">
            <p style="white-space: normal;">Add to your calendar:
              <b style="margin-right: 10px;"><a href="{{calendarEvent.icsDownloadUrl}}">iCal File</a></b> |
              <b style="margin: 0 10px;"><a href="{{calendarEvent.appleCalendarUrl}}">Apple Calendar</a></b> |
              <b style="margin: 0 10px;"><a href="{{calendarEvent.googleCalendarUrl}}">Google Calendar</a></b> |
              <b style="margin-left: 10px;"><a href="{{calendarEvent.outlookCalendarUrl}}">Outlook</a></b>
            </p>
          </div>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});