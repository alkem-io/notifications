import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import {
  NotificationEventPayloadPlatformGlobalRole,
  RoleChangeType,
} from '@alkemio/notifications-lib';
import { User } from '@core/models';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

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

const actor = {
  id: 'actor-1',
  firstName: 'Alice',
  lastName: 'Actor',
  email: 'alice@example.com',
  type: 'USER',
  profile: {
    displayName: 'Alice Actor',
    url: 'https://alkemio.dev/users/actor-1',
  },
};

const affectedUser = {
  id: 'affected-1',
  firstName: 'Uma',
  lastName: 'User',
  email: 'uma@example.com',
  type: 'USER',
  profile: {
    displayName: 'Uma User',
    url: 'https://alkemio.dev/users/affected-1',
  },
};

const basePlatform = { url: 'https://alkemio.dev' };

const buildPayload = (
  role: string
): NotificationEventPayloadPlatformGlobalRole => ({
  eventType: 'PlatformGlobalRoleChange',
  triggeredBy: actor,
  recipients: [recipientPayload],
  platform: basePlatform,
  user: affectedUser,
  role,
  type: RoleChangeType.ADDED,
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

describe('NotificationEmailPayloadBuilderService — platform global role change (role label)', () => {
  describe('createEmailTemplatePayloadPlatformGlobalRoleChange', () => {
    // -----------------------------------------------------------------------
    // Role slug → human-readable label (the 14 target `Platform …` /
    // `Feature …` roles from the 027 role model)
    // -----------------------------------------------------------------------
    const ROLE_LABEL_MAP: Array<{ slug: string; label: string }> = [
      { slug: 'platform-roles-admin', label: 'Platform Roles Admin' },
      {
        slug: 'platform-content-full-access',
        label: 'Platform Content Full Access',
      },
      { slug: 'platform-resource-admin', label: 'Platform Resource Admin' },
      { slug: 'platform-settings-admin', label: 'Platform Settings Admin' },
      { slug: 'platform-users-admin', label: 'Platform Users Admin' },
      { slug: 'platform-support', label: 'Platform Support' },
      {
        slug: 'platform-license-manager',
        label: 'Platform License Manager',
      },
      { slug: 'platform-spaces-reader', label: 'Platform Spaces Reader' },
      { slug: 'platform-audit-reader', label: 'Platform Audit Reader' },
      {
        slug: 'platform-operations-admin',
        label: 'Platform Operations Admin',
      },
      { slug: 'feature-beta-tester', label: 'Feature Beta Tester' },
      {
        slug: 'feature-virtual-assistant',
        label: 'Feature Virtual Assistant',
      },
      {
        slug: 'feature-organization-creator',
        label: 'Feature Organization Creator',
      },
      { slug: 'feature-vc-campaign', label: 'Feature VC Campaign' },
    ];

    it.each(ROLE_LABEL_MAP)(
      'resolves role slug "$slug" to label "$label"',
      ({ slug, label }) => {
        const service = createService();
        const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
          buildPayload(slug),
          recipient
        );

        expect(result.role).toBe(label);
      }
    );

    it('resolves an unknown future role slug to a humanized fallback, never throws', () => {
      const service = createService();
      expect(() => {
        const result =
          service.createEmailTemplatePayloadPlatformGlobalRoleChange(
            buildPayload('some-future-role'),
            recipient
          );
        expect(result.role).toBe('Some Future Role');
      }).not.toThrow();
    });

    it('resolves a legacy credential slug (retiring Slice A credential mutations) to a humanized fallback, never throws', () => {
      const service = createService();
      expect(() => {
        const result =
          service.createEmailTemplatePayloadPlatformGlobalRoleChange(
            buildPayload('global-support'),
            recipient
          );
        expect(result.role).toBe('Global Support');
      }).not.toThrow();
    });

    it('never leaks a raw "platform-" slug into the rendered role field', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
        buildPayload('platform-resource-admin'),
        recipient
      );

      expect(result.role).not.toMatch(/platform-/);
    });

    it('keeps type, user and actor unchanged', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
        buildPayload('platform-support'),
        recipient
      );

      expect(result.type).toBe(RoleChangeType.ADDED);
      expect(result.user.displayName).toBe('Uma User');
      expect(result.user.email).toBe('uma@example.com');
      expect(result.actor.displayName).toBe('Alice Actor');
      expect(result.triggeredBy).toBe('actor-1');
    });
  });
});
