// eslint-disable-next-line @typescript-eslint/no-var-requires
var templates = require('./alkemio.template.blocks');
/* eslint-disable quotes */
module.exports = () => ({
  name: 'space.collaboration.callout.reaction',
  title:
    '{{space.displayName}} - {{reactor.displayName}} reacted to your Post "{{callout.displayName}}"',
  version: 1,
  channels: {
    email: {
      to: '{{recipient.email}}',
      subject:
        '{{reactor.displayName}} reacted {{reaction.emojiGlyph}} to your Post "{{callout.displayName}}" in {{space.displayName}}',
      html: `{% extends "src/email-templates/_layouts/email-transactional.html" %}
        {% block content %}Hi {{recipient.firstName}},<br><br>

        <b>{{reactor.displayName}}</b> reacted {{reaction.emojiGlyph}} to your Post: <a style="color:#1d384a; text-decoration: none;" href={{callout.url}}>{{callout.displayName}}</a>.
        <br><br>
        <a class="action-button" href="{{callout.url}}">VIEW POST</a><br><br>
        {% endblock %}
        ${templates.footerBlock}`,
    },
  },
});
