import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import {
  NotificationEventPayloadSpacePollVoteCastOnOwnPoll,
  NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn,
  NotificationEventPayloadSpacePollModifiedOnPollIVotedOn,
  NotificationEventPayloadSpacePollVoteAffectedByOptionChange,
} from '@alkemio/notifications-lib';
import { User } from '@core/models';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

/** Used as the second argument (recipient: User) to builder methods. */
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

/**
 * Used inside event payload `recipients[]`.
 * UserPayload requires a `type` field that the local User model omits.
 */
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

const voter = {
  id: 'voter-1',
  firstName: 'Jane',
  lastName: 'Voter',
  email: 'jane@example.com',
  type: 'USER',
  profile: {
    displayName: 'Jane Voter',
    url: 'https://alkemio.dev/users/voter-1',
  },
};

const modifier = {
  id: 'mod-1',
  firstName: 'Max',
  lastName: 'Modifier',
  email: 'max@example.com',
  type: 'USER',
  profile: {
    displayName: 'Max Modifier',
    url: 'https://alkemio.dev/users/mod-1',
  },
};

const basePoll = {
  id: 'poll-1',
  title: 'What should we build next?',
  calloutId: 'callout-42',
  calloutTitle: 'Community Polls',
  calloutUrl: 'https://alkemio.dev/spaces/solaris/collaboration/callout-42',
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

describe('NotificationEmailPayloadBuilderService — poll notifications', () => {
  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll', () => {
    const basePayload: NotificationEventPayloadSpacePollVoteCastOnOwnPoll = {
      eventType: 'SpaceCollaborationPollVoteCastOnOwnPoll',
      triggeredBy: voter,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      poll: basePoll,
    };

    it('maps poll.calloutTitle and poll.calloutUrl from the event payload', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
          basePayload,
          recipient
        );

      expect(result.poll.calloutTitle).toBe('Community Polls');
      expect(result.poll.calloutUrl).toBe(
        'https://alkemio.dev/spaces/solaris/collaboration/callout-42'
      );
    });

    it('maps voter.name from triggeredBy.profile.displayName', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
          basePayload,
          recipient
        );

      expect(result.voter.name).toBe('Jane Voter');
    });

    it('includes correct space and recipient base fields', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
          basePayload,
          recipient
        );

      expect(result.space.displayName).toBe('Solaris Lab');
      expect(result.space.type).toBe('space');
      expect(result.recipient.email).toBe('rita@example.com');
      expect(result.recipient.notificationPreferences).toBe(
        'https://alkemio.dev/users/recipient-1/settings/notifications'
      );
    });

    it('identifies subspace correctly when space level is not 0', () => {
      const service = createService();
      const payload: NotificationEventPayloadSpacePollVoteCastOnOwnPoll = {
        ...basePayload,
        space: { ...baseSpace, level: '1' },
      };

      const result =
        service.createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
          payload,
          recipient
        );

      expect(result.space.type).toBe('subspace');
      expect(result.space.level).toBe('1');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn', () => {
    const basePayload: NotificationEventPayloadSpacePollVoteCastOnPollIVotedOn =
      {
        eventType: 'SpaceCollaborationPollVoteCastOnPollIVotedOn',
        triggeredBy: voter,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        poll: basePoll,
      };

    it('maps poll.calloutTitle and poll.calloutUrl from the event payload', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn(
          basePayload,
          recipient
        );

      expect(result.poll.calloutTitle).toBe('Community Polls');
      expect(result.poll.calloutUrl).toBe(
        'https://alkemio.dev/spaces/solaris/collaboration/callout-42'
      );
    });

    it('maps voter.name from triggeredBy.profile.displayName', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn(
          basePayload,
          recipient
        );

      expect(result.voter.name).toBe('Jane Voter');
    });

    it('produces the same poll/voter/space shape as the own-poll variant for identical inputs', () => {
      const service = createService();
      const ownPollPayload: NotificationEventPayloadSpacePollVoteCastOnOwnPoll =
        {
          eventType: 'SpaceCollaborationPollVoteCastOnOwnPoll',
          triggeredBy: voter,
          recipients: [recipientPayload],
          platform: basePlatform,
          space: baseSpace,
          poll: basePoll,
        };

      const resultOwn =
        service.createEmailTemplatePayloadSpacePollVoteCastOnOwnPoll(
          ownPollPayload,
          recipient
        );
      const resultPrior =
        service.createEmailTemplatePayloadSpacePollVoteCastOnPollIVotedOn(
          basePayload,
          recipient
        );

      expect(resultPrior.poll).toEqual(resultOwn.poll);
      expect(resultPrior.voter).toEqual(resultOwn.voter);
      expect(resultPrior.space).toEqual(resultOwn.space);
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn', () => {
    const basePayload: NotificationEventPayloadSpacePollModifiedOnPollIVotedOn =
      {
        eventType: 'SpaceCollaborationPollModifiedOnPollIVotedOn',
        triggeredBy: modifier,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        poll: basePoll,
      };

    it('maps poll.calloutTitle and poll.calloutUrl from the event payload', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn(
          basePayload,
          recipient
        );

      expect(result.poll.calloutTitle).toBe('Community Polls');
      expect(result.poll.calloutUrl).toBe(
        'https://alkemio.dev/spaces/solaris/collaboration/callout-42'
      );
    });

    it('does not include a voter field (impersonal notification)', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn(
          basePayload,
          recipient
        );

      expect((result as any).voter).toBeUndefined();
    });

    it('includes correct space and recipient base fields', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn(
          basePayload,
          recipient
        );

      expect(result.space.displayName).toBe('Solaris Lab');
      expect(result.recipient.email).toBe('rita@example.com');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange', () => {
    const basePayload: NotificationEventPayloadSpacePollVoteAffectedByOptionChange =
      {
        eventType: 'SpaceCollaborationPollVoteAffectedByOptionChange',
        triggeredBy: modifier,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        poll: basePoll,
      };

    it('maps poll.calloutTitle and poll.calloutUrl from the event payload', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange(
          basePayload,
          recipient
        );

      expect(result.poll.calloutTitle).toBe('Community Polls');
      expect(result.poll.calloutUrl).toBe(
        'https://alkemio.dev/spaces/solaris/collaboration/callout-42'
      );
    });

    it('does not include a voter field (impersonal notification)', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange(
          basePayload,
          recipient
        );

      expect((result as any).voter).toBeUndefined();
    });

    it('produces the same shape as the poll-modified variant for identical inputs', () => {
      const service = createService();
      const modifiedPayload: NotificationEventPayloadSpacePollModifiedOnPollIVotedOn =
        {
          eventType: 'SpaceCollaborationPollModifiedOnPollIVotedOn',
          triggeredBy: modifier,
          recipients: [recipientPayload],
          platform: basePlatform,
          space: baseSpace,
          poll: basePoll,
        };

      const resultModified =
        service.createEmailTemplatePayloadSpacePollModifiedOnPollIVotedOn(
          modifiedPayload,
          recipient
        );
      const resultAffected =
        service.createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange(
          basePayload,
          recipient
        );

      expect(resultAffected.poll).toEqual(resultModified.poll);
      expect(resultAffected.space).toEqual(resultModified.space);
      expect(resultAffected.recipient).toEqual(resultModified.recipient);
    });

    it('reflects updated calloutTitle and calloutUrl when poll fields change', () => {
      const service = createService();
      const payload: NotificationEventPayloadSpacePollVoteAffectedByOptionChange =
        {
          ...basePayload,
          poll: {
            ...basePoll,
            calloutTitle: 'Other Poll',
            calloutUrl:
              'https://alkemio.dev/spaces/solaris/collaboration/other',
          },
        };

      const result =
        service.createEmailTemplatePayloadSpacePollVoteAffectedByOptionChange(
          payload,
          recipient
        );

      expect(result.poll.calloutTitle).toBe('Other Poll');
      expect(result.poll.calloutUrl).toBe(
        'https://alkemio.dev/spaces/solaris/collaboration/other'
      );
    });
  });
});
