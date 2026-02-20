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

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Add to your calendar:</p>
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 500px;">
              <tr>
                <td style="padding: 5px; text-align: center; width: 50%;">
                  <a href="{{calendarEvent.googleCalendarUrl}}" style="display: inline-block; background-color: #4285F4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">
                    Google Calendar
                  </a>
                </td>
                <td style="padding: 5px; text-align: center; width: 50%;">
                  <a href="{{calendarEvent.outlookCalendarUrl}}" style="display: inline-block; background-color: #0078D4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">
                    Outlook
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 5px; text-align: center; width: 50%;">
                  <a href="{{calendarEvent.appleCalendarUrl}}" style="display: inline-block; background-color: #555555; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">
                    Apple Calendar
                  </a>
                </td>
                <td style="padding: 5px; text-align: center; width: 50%;">
                  <a href="{{calendarEvent.icsDownloadUrl}}" style="display: inline-block; background-color: #FF9800; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">
                    iCal File
                  </a>
                </td>
              </tr>
            </table>
          </div>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});