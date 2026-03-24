import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import {
  NotificationEventPayloadSpaceCommunityApplication,
  NotificationEventPayloadSpaceCommunityInvitation,
  NotificationEventPayloadSpaceCommunityInvitationVirtualContributor,
  NotificationEventPayloadSpaceCommunityInvitationPlatform,
  NotificationEventPayloadSpaceCommunityContributor,
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

const baseSpace = {
  id: 'space-1',
  level: '0',
  profile: {
    displayName: 'Solaris Lab',
    url: 'https://alkemio.dev/spaces/solaris',
  },
  adminURL: 'https://alkemio.dev/spaces/solaris/admin',
};

const basePlatform = { url: 'https://alkemio.dev' };

const vcInvitee = {
  id: 'vc-1',
  type: 'VIRTUAL',
  profile: {
    displayName: 'Smart VC',
    url: 'https://alkemio.dev/virtual-contributors/vc-1',
  },
};

const vcHost = {
  id: 'host-1',
  type: 'ORGANIZATION',
  profile: {
    displayName: 'Host Org',
    url: 'https://alkemio.dev/organizations/host-1',
  },
};

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

describe('NotificationEmailPayloadBuilderService — community notifications', () => {
  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCommunityApplication
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCommunityApplication', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityApplication = {
      eventType: 'SpaceCommunityApplicationCreated',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      applicant: actor,
    };

    it('maps applicant from triggeredBy profile', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityApplication(
          basePayload,
          recipient
        );

      expect(result.applicant.firstName).toBe('Alice');
      expect(result.applicant.name).toBe('Alice Actor');
      expect(result.applicant.email).toBe('alice@example.com');
      expect(result.applicant.profile).toBe(
        'https://alkemio.dev/users/actor-1'
      );
    });

    it('maps spaceAdminURL from space', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityApplication(
          basePayload,
          recipient
        );

      expect(result.spaceAdminURL).toBe(
        'https://alkemio.dev/spaces/solaris/admin'
      );
    });

    it('sets space type to "space" when level is 0', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityApplication(
          basePayload,
          recipient
        );

      expect(result.space.type).toBe('space');
      expect(result.space.displayName).toBe('Solaris Lab');
    });

    it('sets space type to "subspace" when level is not 0', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityApplication(
          { ...basePayload, space: { ...baseSpace, level: '2' } },
          recipient
        );

      expect(result.space.type).toBe('subspace');
      expect(result.space.level).toBe('2');
    });

    it('sets correct notificationPreferences URL for recipient', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityApplication(
          basePayload,
          recipient
        );

      expect(result.recipient.notificationPreferences).toBe(
        'https://alkemio.dev/users/recipient-1/settings/notifications'
      );
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceAdminCommunityApplication
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceAdminCommunityApplication', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityApplication = {
      eventType: 'SpaceCommunityApplicationCreated',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      applicant: actor,
    };

    it('maps applicant and spaceAdminURL identically to the user variant', () => {
      const service = createService();
      const adminResult =
        service.createEmailTemplatePayloadSpaceAdminCommunityApplication(
          basePayload,
          recipient
        );
      const userResult =
        service.createEmailTemplatePayloadSpaceCommunityApplication(
          basePayload,
          recipient
        );

      expect(adminResult.applicant).toEqual(userResult.applicant);
      expect(adminResult.spaceAdminURL).toBe(userResult.spaceAdminURL);
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserSpaceCommunityInvitation
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserSpaceCommunityInvitation', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityInvitation = {
      eventType: 'SpaceCommunityInvitationCreated',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      invitee: recipientPayload,
      welcomeMessage: 'Welcome aboard!',
    };

    it('maps inviter from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          basePayload,
          recipient
        );

      expect(result.inviter.firstName).toBe('Alice');
      expect(result.inviter.name).toBe('Alice Actor');
      expect(result.inviter.email).toBe('alice@example.com');
      expect(result.inviter.profile).toBe('https://alkemio.dev/users/actor-1');
    });

    it('constructs invitationsURL from platform URL and config path', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          basePayload,
          recipient
        );

      expect(result.invitationsURL).toBe('https://alkemio.dev/invitations');
    });

    it('strips trailing slash from platform URL when building invitationsURL', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          { ...basePayload, platform: { url: 'https://alkemio.dev/' } },
          recipient
        );

      expect(result.invitationsURL).toBe('https://alkemio.dev/invitations');
    });

    it('passes through welcomeMessage', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          basePayload,
          recipient
        );

      expect(result.welcomeMessage).toBe('Welcome aboard!');
    });

    it('maps spaceAdminURL from space', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityInvitation(
          basePayload,
          recipient
        );

      expect(result.spaceAdminURL).toBe(
        'https://alkemio.dev/spaces/solaris/admin'
      );
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityApplication = {
      eventType: 'SpaceCommunityApplicationDeclined',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      applicant: recipientPayload,
    };

    it('maps decliner from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined(
          basePayload,
          recipient
        );

      expect(result.decliner.firstName).toBe('Alice');
      expect(result.decliner.name).toBe('Alice Actor');
      expect(result.decliner.email).toBe('alice@example.com');
    });

    it('sets spaceURL from space profile URL', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadUserSpaceCommunityApplicationDeclined(
          basePayload,
          recipient
        );

      expect(result.spaceURL).toBe('https://alkemio.dev/spaces/solaris');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadVirtualContributorInvitation
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadVirtualContributorInvitation', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor =
      {
        eventType: 'SpaceCommunityVCInvitationCreated',
        triggeredBy: actor,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        invitee: vcInvitee,
        host: vcHost,
        welcomeMessage: 'Hello VC!',
      };

    it('maps virtualContributor from invitee', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadVirtualContributorInvitation(
          basePayload,
          recipient
        );

      expect(result.virtualContributor.name).toBe('Smart VC');
      expect(result.virtualContributor.url).toBe(
        'https://alkemio.dev/virtual-contributors/vc-1'
      );
    });

    it('maps inviter from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadVirtualContributorInvitation(
          basePayload,
          recipient
        );

      expect(result.inviter.firstName).toBe('Alice');
      expect(result.inviter.name).toBe('Alice Actor');
    });

    it('passes through welcomeMessage', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadVirtualContributorInvitation(
          basePayload,
          recipient
        );

      expect(result.welcomeMessage).toBe('Hello VC!');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadVirtualContributorInvitationDeclined
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadVirtualContributorInvitationDeclined', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityInvitationVirtualContributor =
      {
        eventType: 'SpaceCommunityVCInvitationDeclined',
        triggeredBy: actor,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        invitee: vcInvitee,
        host: vcHost,
      };

    it('maps virtualContributor from host', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadVirtualContributorInvitationDeclined(
          basePayload,
          recipient
        );

      expect(result.virtualContributor.name).toBe('Host Org');
      expect(result.virtualContributor.url).toBe(
        'https://alkemio.dev/organizations/host-1'
      );
    });

    it('maps decliner from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadVirtualContributorInvitationDeclined(
          basePayload,
          recipient
        );

      expect(result.decliner.firstName).toBe('Alice');
      expect(result.decliner.name).toBe('Alice Actor');
    });

    it('sets spaceURL from space profile URL', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadVirtualContributorInvitationDeclined(
          basePayload,
          recipient
        );

      expect(result.spaceURL).toBe('https://alkemio.dev/spaces/solaris');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCommunityInvitationPlatform
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCommunityInvitationPlatform', () => {
    const basePayload: NotificationEventPayloadSpaceCommunityInvitationPlatform =
      {
        eventType: 'SpaceCommunityPlatformInvitationCreated',
        triggeredBy: actor,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        welcomeMessage: 'Join us!',
      };

    it('sets emails to the recipient email', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
          basePayload,
          recipient
        );

      expect(result.emails).toBe('rita@example.com');
    });

    it('constructs invitationsURL from platform URL and config path', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
          basePayload,
          recipient
        );

      expect(result.invitationsURL).toBe('https://alkemio.dev/invitations');
    });

    it('maps inviter from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
          basePayload,
          recipient
        );

      expect(result.inviter.firstName).toBe('Alice');
      expect(result.inviter.name).toBe('Alice Actor');
    });

    it('passes through welcomeMessage', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityInvitationPlatform(
          basePayload,
          recipient
        );

      expect(result.welcomeMessage).toBe('Join us!');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserSpaceCommunityJoined
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserSpaceCommunityJoined', () => {
    const baseContributor = {
      id: 'user-2',
      type: 'USER',
      profile: {
        displayName: 'Bob Joiner',
        url: 'https://alkemio.dev/users/bob',
      },
    };

    const basePayload: NotificationEventPayloadSpaceCommunityContributor = {
      eventType: 'SpaceCommunityNewMember',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      contributor: baseContributor,
    };

    it('maps member name and profile from contributor', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserSpaceCommunityJoined(
        basePayload,
        recipient
      );

      expect(result.member.name).toBe('Bob Joiner');
      expect(result.member.profile).toBe('https://alkemio.dev/users/bob');
    });

    it('preserves non-virtual contributor type as-is', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserSpaceCommunityJoined(
        basePayload,
        recipient
      );

      expect(result.member.type).toBe('USER');
    });

    it('normalizes virtual contributor type to "Virtual Contributor"', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserSpaceCommunityJoined(
        {
          ...basePayload,
          contributor: { ...baseContributor, type: 'VIRTUAL' },
        },
        recipient
      );

      expect(result.member.type).toBe('Virtual Contributor');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceAdminCommunityNewMember
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceAdminCommunityNewMember', () => {
    const baseContributor = {
      id: 'user-2',
      type: 'USER',
      profile: {
        displayName: 'Bob Joiner',
        url: 'https://alkemio.dev/users/bob',
      },
    };

    const basePayload: NotificationEventPayloadSpaceCommunityContributor = {
      eventType: 'SpaceCommunityNewMember',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      contributor: baseContributor,
    };

    it('produces the same member mapping as the user-facing variant', () => {
      const service = createService();
      const adminResult =
        service.createEmailTemplatePayloadSpaceAdminCommunityNewMember(
          basePayload,
          recipient
        );
      const userResult =
        service.createEmailTemplatePayloadUserSpaceCommunityJoined(
          basePayload,
          recipient
        );

      expect(adminResult.member).toEqual(userResult.member);
    });

    it('normalizes virtual contributor type to "Virtual Contributor"', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceAdminCommunityNewMember(
          {
            ...basePayload,
            contributor: { ...baseContributor, type: 'VIRTUAL' },
          },
          recipient
        );

      expect(result.member.type).toBe('Virtual Contributor');
    });
  });
});
