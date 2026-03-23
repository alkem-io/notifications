import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import { NotificationEventPayloadSpaceCollaborationCallout } from '@alkemio/notifications-lib';
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

const contributionCreator = {
  id: 'contrib-creator-1',
  type: 'USER',
  profile: {
    displayName: 'Contrib Creator',
    url: 'https://alkemio.dev/users/contrib-creator-1',
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

const baseFraming = {
  id: 'framing-1',
  type: 'Post',
  displayName: 'Ideas Callout',
  description: 'Share your ideas here',
  url: 'https://alkemio.dev/spaces/solaris/callouts/ideas',
};

const baseContribution = {
  id: 'contribution-1',
  type: 'Post',
  displayName: 'My Idea',
  description: 'A great idea',
  url: 'https://alkemio.dev/spaces/solaris/callouts/ideas/posts/my-idea',
  createdBy: contributionCreator,
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

describe('NotificationEmailPayloadBuilderService — callout notifications', () => {
  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCollaborationCalloutContribution
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCollaborationCalloutContribution', () => {
    const basePayload: NotificationEventPayloadSpaceCollaborationCallout = {
      eventType: 'SpaceCollaborationCalloutContribution',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      callout: {
        id: 'callout-1',
        framing: baseFraming,
        contribution: baseContribution,
      },
    };

    it('maps callout displayName and url from framing', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          basePayload,
          recipient
        );

      expect(result.callout.displayName).toBe('Ideas Callout');
      expect(result.callout.url).toBe(
        'https://alkemio.dev/spaces/solaris/callouts/ideas'
      );
    });

    it('maps contribution displayName, url and type', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          basePayload,
          recipient
        );

      expect(result.contribution.displayName).toBe('My Idea');
      expect(result.contribution.url).toBe(
        'https://alkemio.dev/spaces/solaris/callouts/ideas/posts/my-idea'
      );
      expect(result.contribution.type).toBe('Post');
    });

    it('maps createdBy from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          basePayload,
          recipient
        );

      expect(result.createdBy.firstName).toBe('Alice');
      expect(result.createdBy.email).toBe('alice@example.com');
    });

    it('throws when contribution is missing', () => {
      const service = createService();
      const payloadWithoutContribution: NotificationEventPayloadSpaceCollaborationCallout =
        {
          ...basePayload,
          callout: { ...basePayload.callout, contribution: undefined },
        };

      expect(() =>
        service.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          payloadWithoutContribution,
          recipient
        )
      ).toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution', () => {
    const basePayload: NotificationEventPayloadSpaceCollaborationCallout = {
      eventType: 'SpaceCollaborationCalloutContribution',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      callout: {
        id: 'callout-1',
        framing: baseFraming,
        contribution: baseContribution,
      },
    };

    it('produces the same callout and contribution shape as the user variant', () => {
      const service = createService();
      const adminResult =
        service.createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
          basePayload,
          recipient
        );
      const userResult =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutContribution(
          basePayload,
          recipient
        );

      expect(adminResult.callout).toEqual(userResult.callout);
      expect(adminResult.contribution).toEqual(userResult.contribution);
    });

    it('throws when contribution is missing', () => {
      const service = createService();
      const payloadWithoutContribution: NotificationEventPayloadSpaceCollaborationCallout =
        {
          ...basePayload,
          callout: { ...basePayload.callout, contribution: undefined },
        };

      expect(() =>
        service.createEmailTemplatePayloadSpaceAdminCollaborationCalloutContribution(
          payloadWithoutContribution,
          recipient
        )
      ).toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCollaborationCalloutComment
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCollaborationCalloutComment', () => {
    const basePayload: NotificationEventPayloadSpaceCollaborationCallout = {
      eventType: 'SpaceCollaborationCalloutComment',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      callout: {
        id: 'callout-1',
        framing: { ...baseFraming, type: 'Post' },
      },
    };

    it('maps createdBy from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          basePayload,
          recipient
        );

      expect(result.createdBy.firstName).toBe('Alice');
      expect(result.createdBy.email).toBe('alice@example.com');
    });

    it('maps callout displayName and url from framing', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          basePayload,
          recipient
        );

      expect(result.callout.displayName).toBe('Ideas Callout');
      expect(result.callout.url).toBe(
        'https://alkemio.dev/spaces/solaris/callouts/ideas'
      );
    });

    it('preserves a valid callout framing type', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          basePayload,
          recipient
        );

      expect(result.callout.type).toBe('Post');
    });

    it('normalizes null framing type to "Post"', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          {
            ...basePayload,
            callout: {
              ...basePayload.callout,
              framing: { ...baseFraming, type: null as unknown as string },
            },
          },
          recipient
        );

      expect(result.callout.type).toBe('Post');
    });

    it('normalizes framing type "none" to "Post"', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          {
            ...basePayload,
            callout: {
              ...basePayload.callout,
              framing: { ...baseFraming, type: 'none' },
            },
          },
          recipient
        );

      expect(result.callout.type).toBe('Post');
    });

    it('preserves other framing types unchanged', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutComment(
          {
            ...basePayload,
            callout: {
              ...basePayload.callout,
              framing: { ...baseFraming, type: 'Whiteboard' },
            },
          },
          recipient
        );

      expect(result.callout.type).toBe('Whiteboard');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment', () => {
    const basePayload: NotificationEventPayloadSpaceCollaborationCallout = {
      eventType: 'SpaceCollaborationCalloutPostContributionComment',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      callout: {
        id: 'callout-1',
        framing: baseFraming,
        contribution: baseContribution,
      },
    };

    it('maps callout and post (contribution) fields', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
          basePayload,
          recipient
        );

      expect(result.callout.displayName).toBe('Ideas Callout');
      expect(result.post.displayName).toBe('My Idea');
      expect(result.post.url).toBe(
        'https://alkemio.dev/spaces/solaris/callouts/ideas/posts/my-idea'
      );
    });

    it('maps createdBy from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
          basePayload,
          recipient
        );

      expect(result.createdBy.firstName).toBe('Alice');
      expect(result.createdBy.email).toBe('alice@example.com');
    });

    it('throws when contribution is missing', () => {
      const service = createService();
      const payloadWithoutContribution: NotificationEventPayloadSpaceCollaborationCallout =
        {
          ...basePayload,
          callout: { ...basePayload.callout, contribution: undefined },
        };

      expect(() =>
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPostContributionComment(
          payloadWithoutContribution,
          recipient
        )
      ).toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCollaborationCalloutPublished
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCollaborationCalloutPublished', () => {
    const basePayload: NotificationEventPayloadSpaceCollaborationCallout = {
      eventType: 'SpaceCollaborationCalloutPublished',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      callout: {
        id: 'callout-1',
        framing: { ...baseFraming, type: 'Whiteboard' },
      },
    };

    it('maps publishedBy firstName from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
          basePayload,
          recipient
        );

      expect(result.publishedBy.firstName).toBe('Alice');
    });

    it('maps callout displayName, url and type from framing', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
          basePayload,
          recipient
        );

      expect(result.callout.displayName).toBe('Ideas Callout');
      expect(result.callout.url).toBe(
        'https://alkemio.dev/spaces/solaris/callouts/ideas'
      );
      expect(result.callout.type).toBe('Whiteboard');
    });

    it('normalizes "none" framing type to "Post"', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
          {
            ...basePayload,
            callout: {
              ...basePayload.callout,
              framing: { ...baseFraming, type: 'none' },
            },
          },
          recipient
        );

      expect(result.callout.type).toBe('Post');
    });

    it('includes correct space and recipient base fields', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCollaborationCalloutPublished(
          basePayload,
          recipient
        );

      expect(result.space.displayName).toBe('Solaris Lab');
      expect(result.recipient.email).toBe('rita@example.com');
    });
  });
});
