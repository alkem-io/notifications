import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import { NotificationEventPayloadSpaceCollaborationCalloutReaction } from '@alkemio/notifications-lib';
import { User } from '@core/models';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const recipient: User = {
  id: 'publisher-1',
  firstName: 'Paula',
  lastName: 'Publisher',
  email: 'paula@example.com',
  profile: {
    displayName: 'Paula Publisher',
    url: 'https://alkemio.dev/users/publisher-1',
  },
};

const reactor = {
  id: 'reactor-1',
  firstName: 'Remy',
  lastName: 'Reactor',
  email: 'remy@example.com',
  type: 'USER',
  profile: {
    displayName: 'Remy Reactor',
    url: 'https://alkemio.dev/users/reactor-1',
  },
};

const baseSpace = {
  id: 'space-1',
  level: '0',
  profile: {
    displayName: 'Innovation Hub',
    url: 'https://alkemio.dev/spaces/innovation',
  },
  adminURL: 'https://alkemio.dev/spaces/innovation/admin',
};

const baseFraming = {
  id: 'framing-1',
  type: 'Post',
  displayName: 'Future of Work',
  description: 'A callout about the future of work',
  url: 'https://alkemio.dev/spaces/innovation/callouts/future-of-work',
};

const buildPayload = (
  emoji: string
): NotificationEventPayloadSpaceCollaborationCalloutReaction => ({
  eventType: 'SPACE_COLLABORATION_CALLOUT_REACTION',
  triggeredBy: reactor,
  recipients: [
    {
      id: 'publisher-1',
      firstName: 'Paula',
      lastName: 'Publisher',
      email: 'paula@example.com',
      type: 'USER',
      profile: {
        displayName: 'Paula Publisher',
        url: 'https://alkemio.dev/users/publisher-1',
      },
    },
  ],
  platform: { url: 'https://alkemio.dev' },
  space: baseSpace,
  callout: {
    id: 'callout-1',
    framing: baseFraming,
  },
  reaction: { emoji },
});

const createService = () => {
  const configService = {
    get: jest.fn().mockReturnValue({
      webclient_invitations_path: '/invitations',
    }),
  } as unknown as ConfigService;
  return new NotificationEmailPayloadBuilderService(configService);
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('NotificationEmailPayloadBuilderService — callout reaction notifications', () => {
  describe('createEmailTemplatePayloadSpaceCollaborationCalloutReaction', () => {
    it('maps reactor displayName from triggeredBy profile', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
        buildPayload('heart'),
        recipient
      );

      expect(result.reactor.displayName).toBe('Remy Reactor');
    });

    it('maps callout displayName and url from framing', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
        buildPayload('rocket'),
        recipient
      );

      expect(result.callout.displayName).toBe('Future of Work');
      expect(result.callout.url).toBe(
        'https://alkemio.dev/spaces/innovation/callouts/future-of-work'
      );
    });

    it('carries the emoji slug unchanged', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
        buildPayload('light-bulb'),
        recipient
      );

      expect(result.reaction.emoji).toBe('light-bulb');
    });

    it('does NOT include any callout content/description field', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
        buildPayload('heart'),
        recipient
      ) as unknown as Record<string, unknown>;

      expect(result['description']).toBeUndefined();
      expect(result['content']).toBeUndefined();
      // callout itself must have no description
      const callout = result['callout'] as Record<string, unknown>;
      expect(callout['description']).toBeUndefined();
    });

    it('maps space displayName from space profile', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
        buildPayload('check-mark'),
        recipient
      );

      expect(result.space.displayName).toBe('Innovation Hub');
    });

    it('maps recipient email from recipient user', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
        buildPayload('heart'),
        recipient
      );

      expect(result.recipient.email).toBe('paula@example.com');
    });

    // -----------------------------------------------------------------------
    // Slug → glyph mapping (7 allow-listed slugs + unknown fallback)
    // -----------------------------------------------------------------------
    const SLUG_GLYPH_MAP: Array<{ slug: string; glyph: string }> = [
      { slug: 'heart', glyph: '❤️' },
      { slug: 'hugging-face', glyph: '🤗' },
      { slug: 'clapping-hands', glyph: '👏' },
      { slug: 'light-bulb', glyph: '💡' },
      { slug: 'bullseye', glyph: '🎯' },
      { slug: 'check-mark', glyph: '✅' },
      { slug: 'rocket', glyph: '🚀' },
    ];

    it.each(SLUG_GLYPH_MAP)(
      'resolves slug "$slug" to glyph "$glyph"',
      ({ slug, glyph }) => {
        const service = createService();
        const result = service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
          buildPayload(slug),
          recipient
        );

        expect(result.reaction.emojiGlyph).toBe(glyph);
      }
    );

    it('resolves an unknown slug to a humanized text fallback, never throws', () => {
      const service = createService();
      expect(() => {
        const result =
          service.createEmailTemplatePayloadSpaceCollaborationCalloutReaction(
            buildPayload('some-future-emoji'),
            recipient
          );
        // Unknown slug is humanized: hyphens become spaces
        expect(result.reaction.emojiGlyph).toBe('some future emoji');
      }).not.toThrow();
    });
  });
});
