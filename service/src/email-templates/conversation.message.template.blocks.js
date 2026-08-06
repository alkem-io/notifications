/* eslint-disable quotes */
// 034-messaging-notifications (Ruling R1: two full wire events / two
// templates; a shared partial is allowed to avoid copy-paste drift), revised
// for Operator Ruling R4 — both templates now render a DIGEST: one row per
// entry, each linked to its own conversation deep link (C-6).
//
// Deliberately content-free: display name + unread count + link, nothing else.
// No message text, no reply-to, no sender identity in the group digest — see
// each template's header comment for the full FR-008/FR-009/FR-018a rationale.
//
// `entriesExpr` is the payload field holding the rows: `senders` for the direct
// digest, `conversations` for the group one. Rendered in the HTML body only,
// where nunjucks autoescaping is ON — display names are user-controlled free
// text and MUST be escaped there. The loop is emitted on a single source line
// because the layout styles `.content` with `white-space: pre-line`, so stray
// newlines would become stray blank lines in the email.
module.exports = {
  digestRows: entriesExpr =>
    `{% for entry in ${entriesExpr} %}<div style="padding: 4px 0;"><a style="color: #1d384a; text-decoration: underline;" href="{{entry.url}}"><b>{{entry.displayName}}</b> — {{entry.count}}</a></div>{% endfor %}`,
};
