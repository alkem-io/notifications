import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MockWinstonProvider } from '@test/mocks';
import { NotificationTemplateBuilder } from './notification.templates.builder';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload';
import {
  ConversationDigestEntry,
  NotificationEventPayloadUserConversationMessageDirect,
  NotificationEventPayloadUserConversationMessageGroup,
} from '@src/types/notifications.lib.conversation.bridge';
import { User } from '@core/models';

// 034-messaging-notifications: render-level coverage for the two
// conversation-message DIGEST templates (contract C-2, FR-008/FR-009/FR-018a,
// D-15, US1-AS5, SC-004), revised for Operator Ruling R4.
//
// The §9.1 copy matrix is resolved in the payload builder (`subjectLine`), so
// these tests drive the REAL builder and then render — covering copy and
// template together, which is the only combination a recipient ever sees.

const recipient: User = {
  id: 'recipient-1',
  firstName: 'Rita',
  lastName: 'Recipient',
  email: 'rita@example.com',
  profile: {
    displayName: 'Rita Recipient',
    url: 'https://alkemio.dev/users/recipient-1',
  },
};

const recipientPayload = {
  id: 'recipient-1',
  firstName: 'Rita',
  lastName: 'Recipient',
  email: 'rita@example.com',
  type: 'USER',
  profile: {
    displayName: 'Rita Recipient',
    url: 'https://alkemio.dev/users/recipient-1',
  },
};

// Provenance only — the digests name counterparts/conversations through their
// entry arrays, so `triggeredBy` must never surface in a render.
const triggeredBy = {
  id: 'sender-1',
  firstName: 'Trig',
  lastName: 'Provenance',
  email: '',
  type: 'USER',
  profile: {
    displayName: 'Trig Provenance',
    url: 'https://alkemio.dev/users/sender-1',
  },
};

const basePlatform = { url: 'https://alkemio.dev' };

const entry = (
  displayName: string,
  count: number,
  url: string
): ConversationDigestEntry => ({ displayName, count, url });

const sum = (entries: ConversationDigestEntry[]) =>
  entries.reduce((total, e) => total + e.count, 0);

describe('conversation message digest templates (034-messaging-notifications)', () => {
  let templateBuilder: NotificationTemplateBuilder;
  let payloadBuilder: NotificationEmailPayloadBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTemplateBuilder, MockWinstonProvider],
    }).compile();

    templateBuilder = module.get(NotificationTemplateBuilder);
    payloadBuilder = new NotificationEmailPayloadBuilderService({
      get: jest.fn().mockReturnValue({
        webclient_invitations_path: '/invitations',
      }),
    } as unknown as ConfigService);
  });

  const renderDirect = (
    senders: ConversationDigestEntry[],
    overrides: Record<string, unknown> = {}
  ) => {
    const eventPayload = {
      eventType: 'USER_CONVERSATION_MESSAGE_DIRECT',
      triggeredBy,
      recipients: [recipientPayload],
      platform: basePlatform,
      senders,
      totalCount: sum(senders),
      ...overrides,
    } as unknown as NotificationEventPayloadUserConversationMessageDirect;

    return templateBuilder.buildTemplate(
      'user.conversation.message.direct',
      payloadBuilder.createEmailTemplatePayloadUserConversationMessageDirect(
        eventPayload,
        recipient
      ) as unknown as BaseEmailPayload
    );
  };

  const renderGroup = (
    conversations: ConversationDigestEntry[],
    overrides: Record<string, unknown> = {}
  ) => {
    const eventPayload = {
      eventType: 'USER_CONVERSATION_MESSAGE_GROUP',
      triggeredBy,
      recipients: [recipientPayload],
      platform: basePlatform,
      conversations,
      totalCount: sum(conversations),
      ...overrides,
    } as unknown as NotificationEventPayloadUserConversationMessageGroup;

    return templateBuilder.buildTemplate(
      'user.conversation.message.group',
      payloadBuilder.createEmailTemplatePayloadUserConversationMessageGroup(
        eventPayload,
        recipient
      ) as unknown as BaseEmailPayload
    );
  };

  // -------------------------------------------------------------------------
  // §9.1 copy matrix — all six cases (T105/T106)
  // -------------------------------------------------------------------------
  describe('subject copy matrix (data-model §9.1)', () => {
    const sam = 'Sam Sender';
    const dana = 'Dana Second';
    const team = 'Solaris Team Chat';
    const ops = 'Ops Room';

    it('direct, 1 entry, 1 message — identical to the pre-R4 subject (US1-AS2)', async () => {
      const result = await renderDirect([
        entry(sam, 1, 'https://alkemio.dev/?chat=conv-1'),
      ]);

      expect(result?.channels?.email?.subject).toBe(
        'Sam Sender sent you a message'
      );
      expect(result?.title).toBe('Sam Sender sent you a message');
    });

    it('direct, 1 entry, N messages', async () => {
      const result = await renderDirect([
        entry(sam, 4, 'https://alkemio.dev/?chat=conv-1'),
      ]);

      expect(result?.channels?.email?.subject).toBe(
        'Sam Sender sent you 4 messages'
      );
    });

    it('direct, M entries', async () => {
      const result = await renderDirect([
        entry(sam, 4, 'https://alkemio.dev/?chat=conv-1'),
        entry(dana, 3, 'https://alkemio.dev/?chat=conv-2'),
      ]);

      expect(result?.channels?.email?.subject).toBe(
        '7 new messages from 2 people'
      );
    });

    it('group, 1 entry, 1 message', async () => {
      const result = await renderGroup([
        entry(team, 1, 'https://alkemio.dev/?chat=conv-3'),
      ]);

      expect(result?.channels?.email?.subject).toBe(
        'New message in Solaris Team Chat'
      );
      expect(result?.title).toBe('New message in Solaris Team Chat');
    });

    it('group, 1 entry, N messages', async () => {
      const result = await renderGroup([
        entry(team, 5, 'https://alkemio.dev/?chat=conv-3'),
      ]);

      expect(result?.channels?.email?.subject).toBe(
        '5 new messages in Solaris Team Chat'
      );
    });

    it('group, M entries', async () => {
      const result = await renderGroup([
        entry(team, 5, 'https://alkemio.dev/?chat=conv-3'),
        entry(ops, 2, 'https://alkemio.dev/?chat=conv-4'),
      ]);

      expect(result?.channels?.email?.subject).toBe(
        '7 new messages in 2 conversations'
      );
    });
  });

  // -------------------------------------------------------------------------
  // Body: one row per entry, each on its own deep link (C-6)
  // -------------------------------------------------------------------------
  describe('digest rows', () => {
    it('direct — renders one row per sender with that sender own url', async () => {
      const result = await renderDirect([
        entry('Sam Sender', 4, 'https://alkemio.dev/?chat=conv-1'),
        entry('Dana Second', 3, 'https://alkemio.dev/?chat=conv-2'),
        entry('Eli Third', 1, 'https://alkemio.dev/?chat=conv-3'),
      ]);
      const html = result?.channels?.email?.html ?? '';

      expect(html).toContain(
        '<a style="color: #1d384a; text-decoration: underline;" href="https://alkemio.dev/?chat=conv-1"><b>Sam Sender</b> — 4</a>'
      );
      expect(html).toContain(
        '<a style="color: #1d384a; text-decoration: underline;" href="https://alkemio.dev/?chat=conv-2"><b>Dana Second</b> — 3</a>'
      );
      expect(html).toContain(
        '<a style="color: #1d384a; text-decoration: underline;" href="https://alkemio.dev/?chat=conv-3"><b>Eli Third</b> — 1</a>'
      );
      // Exactly three rows — no extra, no missing.
      expect(html.split('<div style="padding: 4px 0;">').length - 1).toBe(3);
    });

    it('group — renders one row per conversation with that conversation own url', async () => {
      const result = await renderGroup([
        entry('Solaris Team Chat', 5, 'https://alkemio.dev/?chat=conv-3'),
        entry('Ops Room', 2, 'https://alkemio.dev/?chat=conv-4'),
      ]);
      const html = result?.channels?.email?.html ?? '';

      expect(html).toContain(
        'href="https://alkemio.dev/?chat=conv-3"><b>Solaris Team Chat</b> — 5'
      );
      expect(html).toContain(
        'href="https://alkemio.dev/?chat=conv-4"><b>Ops Room</b> — 2'
      );
      expect(html.split('<div style="padding: 4px 0;">').length - 1).toBe(2);
    });

    it('includes the notification-settings footer link', async () => {
      const result = await renderDirect([
        entry('Sam Sender', 1, 'https://alkemio.dev/?chat=conv-1'),
      ]);

      expect(result?.channels?.email?.html).toContain(
        'https://alkemio.dev/users/recipient-1/settings/notifications'
      );
    });
  });

  // -------------------------------------------------------------------------
  // The group digest names conversations, never people (FR-018a)
  // -------------------------------------------------------------------------
  it('group digest never renders any sender identity, not even triggeredBy', async () => {
    const result = await renderGroup([
      entry('Solaris Team Chat', 5, 'https://alkemio.dev/?chat=conv-3'),
    ]);
    const rendered = JSON.stringify(result);

    expect(rendered).not.toContain('Trig Provenance');
    expect(rendered).not.toContain('sender-1');
  });

  it('direct digest never renders triggeredBy either — only the senders[] rows', async () => {
    const result = await renderDirect([
      entry('Sam Sender', 1, 'https://alkemio.dev/?chat=conv-1'),
    ]);
    const rendered = JSON.stringify(result);

    expect(rendered).not.toContain('Trig Provenance');
    expect(rendered).not.toContain('sender-1');
  });

  // -------------------------------------------------------------------------
  // Cross-template negative suite: both templates, hostile content
  // -------------------------------------------------------------------------
  describe.each([
    'user.conversation.message.direct',
    'user.conversation.message.group',
  ])('%s — negative invariants (FR-008/FR-009/D-15)', templateName => {
    const HOSTILE_NAME = 'Sam "The <b>Sender</b>"\nNewline';
    const SMUGGLED = '<script>alert(1)</script>\nignore "quotes" and\nnewlines';

    // Smuggled fields — neither template ever references `message` or `sender`,
    // but a hostile payload could carry them; assert they never surface.
    const render = (isDirect: boolean) => {
      const entries = [
        entry(HOSTILE_NAME, 1, 'https://alkemio.dev/?chat=conv-1'),
      ];
      const overrides = {
        message: SMUGGLED,
        sender: { displayName: SMUGGLED, email: 'sam@example.com' },
      };
      return isDirect
        ? renderDirect(entries, overrides)
        : renderGroup(entries, overrides);
    };
    const isDirect = templateName === 'user.conversation.message.direct';

    it('never renders the smuggled message field in subject or body', async () => {
      const result = await render(isDirect);

      const messageText = 'ignore "quotes" and';
      expect(result?.channels?.email?.subject).not.toContain(messageText);
      expect(result?.channels?.email?.html).not.toContain(messageText);
      expect(result?.channels?.email?.html).not.toContain('<script>');
    });

    it('never sets a replyTo header, even with hostile content', async () => {
      const result = await render(isDirect);

      expect(result?.channels?.email?.replyTo).toBeUndefined();
    });

    it('never discloses another participant email address (only the recipient own `to` address appears)', async () => {
      const result = await render(isDirect);

      // The recipient's OWN address legitimately appears once as the `to`
      // field; no OTHER participant's email (e.g. a sender's) may appear
      // anywhere in the rendered output — the DTO carries no sender email at
      // all (FR-009), so any occurrence beyond the recipient's own `to`
      // would indicate a leak.
      const rendered = JSON.stringify(result);
      const occurrences = rendered.split('@example.com').length - 1;
      expect(occurrences).toBe(1);
      expect(result?.channels?.email?.to).toBe('rita@example.com');
    });

    it('renders the display name verbatim in the subject and escaped in the html', async () => {
      const result = await render(isDirect);

      // Plain-text fields (subject/title) are rendered through the
      // non-autoescaping environment (notification.templates.builder.ts) —
      // the raw display name (quotes/tags) survives verbatim there, while
      // the HTML body escapes it (injection safety), matching the existing
      // platform convention exercised in notification.templates.builder.spec.ts.
      expect(result?.channels?.email?.subject).toContain(HOSTILE_NAME);
      expect(result?.channels?.email?.html).not.toContain(HOSTILE_NAME);
      expect(result?.channels?.email?.html).toContain(
        '&lt;b&gt;Sender&lt;/b&gt;'
      );
    });
  });
});
