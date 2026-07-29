// 034-messaging-notifications (Ruling R1: two full wire events / two
// templates; a shared partial is allowed to avoid copy-paste drift). Shared
// by user.conversation.message.direct.js and user.conversation.message.group.js.
//
// Deliberately content-free: only the CTA button linking to the conversation
// deep link (C-6). No message text, no reply-to — see each template's header
// comment for the full FR-008/FR-009 rationale.
module.exports = {
  conversationActionButton: `<a class="action-button" href="{{conversation.url}}">VIEW CONVERSATION</a>`,
};
