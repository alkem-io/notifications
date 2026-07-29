import { Test, TestingModule } from '@nestjs/testing';
import { MockWinstonProvider } from '@test/mocks';
import { NotificationTemplateBuilder } from './notification.templates.builder';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload';

// 034-messaging-notifications: render-level coverage for the two new
// conversation-message templates (contract C-2, FR-008/FR-009, D-15, US1-AS5,
// SC-004). Both templates share the same negative invariants, so the
// negative suite below is parametrized across both.

describe('conversation message templates (034-messaging-notifications)', () => {
  let builder: NotificationTemplateBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTemplateBuilder, MockWinstonProvider],
    }).compile();

    builder = module.get(NotificationTemplateBuilder);
  });

  // -------------------------------------------------------------------------
  // user.conversation.message.direct (T005)
  // -------------------------------------------------------------------------
  describe('user.conversation.message.direct', () => {
    const directPayload = {
      recipient: {
        firstName: 'Rita',
        email: 'rita@example.com',
        notificationPreferences:
          'https://alkemio.dev/users/rita/settings/notifications',
      },
      platform: { url: 'https://alkemio.dev' },
      sender: { displayName: 'Sam Sender' },
      conversation: { url: 'https://alkemio.dev/?chat=conv-1' },
    } as unknown as BaseEmailPayload;

    it('renders the sender display name and the conversation deep link', async () => {
      const result = await builder.buildTemplate(
        'user.conversation.message.direct',
        directPayload
      );

      expect(result?.channels?.email?.html).toContain('Sam Sender');
      expect(result?.channels?.email?.html).toContain(
        'https://alkemio.dev/?chat=conv-1'
      );
      expect(result?.channels?.email?.subject).toContain('Sam Sender');
    });

    it('never sets a replyTo header', async () => {
      const result = await builder.buildTemplate(
        'user.conversation.message.direct',
        directPayload
      );

      expect(result?.channels?.email?.replyTo).toBeUndefined();
    });

    it('includes the notification-settings footer link', async () => {
      const result = await builder.buildTemplate(
        'user.conversation.message.direct',
        directPayload
      );

      expect(result?.channels?.email?.html).toContain(
        'https://alkemio.dev/users/rita/settings/notifications'
      );
    });
  });

  // -------------------------------------------------------------------------
  // user.conversation.message.group (T007)
  // -------------------------------------------------------------------------
  describe('user.conversation.message.group', () => {
    const groupPayload = {
      recipient: {
        firstName: 'Rita',
        email: 'rita@example.com',
        notificationPreferences:
          'https://alkemio.dev/users/rita/settings/notifications',
      },
      platform: { url: 'https://alkemio.dev' },
      sender: { displayName: 'Sam Sender' },
      conversation: {
        url: 'https://alkemio.dev/?chat=conv-2',
        displayName: 'Solaris Team Chat',
      },
    } as unknown as BaseEmailPayload;

    it('renders the sender display name, conversation name, and deep link', async () => {
      const result = await builder.buildTemplate(
        'user.conversation.message.group',
        groupPayload
      );

      expect(result?.channels?.email?.html).toContain('Sam Sender');
      expect(result?.channels?.email?.html).toContain('Solaris Team Chat');
      expect(result?.channels?.email?.html).toContain(
        'https://alkemio.dev/?chat=conv-2'
      );
      expect(result?.channels?.email?.subject).toContain('Solaris Team Chat');
    });

    it('never sets a replyTo header', async () => {
      const result = await builder.buildTemplate(
        'user.conversation.message.group',
        groupPayload
      );

      expect(result?.channels?.email?.replyTo).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Cross-template negative suite (T007): both templates, hostile content
  // -------------------------------------------------------------------------
  describe.each([
    [
      'user.conversation.message.direct',
      (senderDisplayName: string) => ({
        recipient: {
          firstName: 'Rita',
          email: 'rita@example.com',
          notificationPreferences: '',
        },
        platform: { url: 'https://alkemio.dev' },
        sender: { displayName: senderDisplayName },
        conversation: { url: 'https://alkemio.dev/?chat=conv-1' },
        // Smuggled field — neither template ever references `message`, but a
        // hostile payload could carry one; assert it never surfaces.
        message: '<script>alert(1)</script>\nignore "quotes" and\nnewlines',
      }),
    ],
    [
      'user.conversation.message.group',
      (senderDisplayName: string) => ({
        recipient: {
          firstName: 'Rita',
          email: 'rita@example.com',
          notificationPreferences: '',
        },
        platform: { url: 'https://alkemio.dev' },
        sender: { displayName: senderDisplayName },
        conversation: {
          url: 'https://alkemio.dev/?chat=conv-2',
          displayName: 'Solaris Team Chat',
        },
        message: '<script>alert(1)</script>\nignore "quotes" and\nnewlines',
      }),
    ],
  ])('%s — negative invariants (FR-008/FR-009/D-15)', (templateName, mk) => {
    const HOSTILE_SENDER = 'Sam "The <b>Sender</b>"\nNewline';
    const hostilePayload = mk(HOSTILE_SENDER) as unknown as BaseEmailPayload;

    it('never renders the smuggled message field in subject or body', async () => {
      const result = await builder.buildTemplate(templateName, hostilePayload);

      const messageText = 'ignore "quotes" and';
      expect(result?.channels?.email?.subject).not.toContain(messageText);
      expect(result?.channels?.email?.html).not.toContain(messageText);
      expect(result?.channels?.email?.html).not.toContain('<script>');
    });

    it('never sets a replyTo header, even with hostile sender content', async () => {
      const result = await builder.buildTemplate(templateName, hostilePayload);

      expect(result?.channels?.email?.replyTo).toBeUndefined();
    });

    it('never discloses another participant email address (only the recipient own `to` address appears)', async () => {
      const result = await builder.buildTemplate(templateName, hostilePayload);

      // The recipient's OWN address legitimately appears once as the `to`
      // field; no OTHER participant's email (e.g. the sender's) may appear
      // anywhere in the rendered output — the DTO carries no sender email at
      // all (FR-009), so any occurrence beyond the recipient's own `to`
      // would indicate a leak.
      const rendered = JSON.stringify(result);
      const occurrences = rendered.split('@example.com').length - 1;
      expect(occurrences).toBe(1);
      expect(result?.channels?.email?.to).toBe('rita@example.com');
    });

    it('builds subject/title only from sender/conversation display names, never HTML-escaped there', async () => {
      const result = await builder.buildTemplate(templateName, hostilePayload);

      // Plain-text fields (subject/title) are rendered through the
      // non-autoescaping environment (notification.templates.builder.ts) —
      // the raw display name (quotes/tags) survives verbatim there, while
      // the HTML body escapes it (injection safety), matching the existing
      // platform convention exercised in notification.templates.builder.spec.ts.
      expect(result?.channels?.email?.subject).toContain(HOSTILE_SENDER);
      expect(result?.channels?.email?.html).not.toContain(HOSTILE_SENDER);
    });
  });
});
