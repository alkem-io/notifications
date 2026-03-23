import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import {
  NotificationEventPayloadPlatformGlobalRole,
  NotificationEventPayloadPlatformUserRegistration,
  NotificationEventPayloadPlatformUserRemoved,
  NotificationEventPayloadPlatformForumDiscussion,
  NotificationEventPayloadPlatformSpaceCreated,
  NotificationEventPayloadSpaceCalendarEvent,
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

const registeredUser = {
  id: 'new-user-1',
  firstName: 'New',
  lastName: 'User',
  email: 'newuser@example.com',
  type: 'USER',
  profile: {
    displayName: 'New User',
    url: 'https://alkemio.dev/users/new-user-1',
  },
};

const basePlatform = { url: 'https://alkemio.dev' };

const baseSpace = {
  id: 'space-1',
  level: '0',
  profile: {
    displayName: 'Solaris Lab',
    url: 'https://alkemio.dev/spaces/solaris',
  },
  adminURL: 'https://alkemio.dev/spaces/solaris/admin',
};

const discussionCreator = {
  id: 'disc-creator-1',
  type: 'USER',
  profile: {
    displayName: 'Discussion Creator',
    url: 'https://alkemio.dev/users/disc-creator-1',
  },
};

const commentCreator = {
  id: 'comment-creator-1',
  type: 'USER',
  profile: {
    displayName: 'Comment Creator',
    url: 'https://alkemio.dev/users/comment-creator-1',
  },
};

const baseCalendarEvent = {
  id: 'event-1',
  title: 'Community Sync',
  type: 'MEETING',
  createdBy: actor,
  url: 'https://alkemio.dev/spaces/solaris/calendar/event-1',
  startDate: '2025-02-01T10:15:00.000Z',
  endDate: '2025-02-01T11:45:00.000Z',
  wholeDay: false,
  description: 'Monthly community sync-up.',
  location: 'Room 5',
  googleCalendarUrl: 'https://calendar.google.com/event?eid=event-1',
  outlookCalendarUrl: 'https://outlook.live.com/calendar/event-1',
  icsDownloadUrl: 'https://alkemio.dev/calendar/event-1.ics',
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

describe('NotificationEmailPayloadBuilderService — platform notifications', () => {
  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCommunityCalendarEventComment
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCommunityCalendarEventComment', () => {
    const basePayload: NotificationEventPayloadSpaceCalendarEvent = {
      eventType: 'SpaceCommunityCalendarEventComment',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      calendarEvent: baseCalendarEvent,
    };

    it('maps commentor from triggeredBy profile', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventComment(
          basePayload,
          recipient
        );

      expect(result.commentor.name).toBe('Alice Actor');
      expect(result.commentor.profile).toBe(
        'https://alkemio.dev/users/actor-1'
      );
    });

    it('maps calendarEvent title, type and url', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventComment(
          basePayload,
          recipient
        );

      expect(result.calendarEvent.title).toBe('Community Sync');
      expect(result.calendarEvent.type).toBe('MEETING');
      expect(result.calendarEvent.url).toBe(
        'https://alkemio.dev/spaces/solaris/calendar/event-1'
      );
    });

    it('does not expose raw date or wholeDay fields', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventComment(
          basePayload,
          recipient
        );

      expect((result.calendarEvent as any).startDate).toBeUndefined();
      expect((result.calendarEvent as any).wholeDay).toBeUndefined();
    });

    it('sets space type to "subspace" for non-root spaces', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventComment(
          { ...basePayload, space: { ...baseSpace, level: '1' } },
          recipient
        );

      expect(result.space.type).toBe('subspace');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadPlatformGlobalRoleChange
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadPlatformGlobalRoleChange', () => {
    const basePayload: NotificationEventPayloadPlatformGlobalRole = {
      eventType: 'PlatformGlobalRoleChange',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: registeredUser,
      role: 'GLOBAL_ADMIN',
      type: RoleChangeType.ADDED,
    };

    it('maps user fields from event payload user', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
        basePayload,
        recipient
      );

      expect(result.user.displayName).toBe('New User');
      expect(result.user.firstName).toBe('New');
      expect(result.user.email).toBe('newuser@example.com');
      expect(result.user.profile).toBe('https://alkemio.dev/users/new-user-1');
    });

    it('maps actor from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
        basePayload,
        recipient
      );

      expect(result.actor.displayName).toBe('Alice Actor');
      expect(result.actor.url).toBe('https://alkemio.dev/users/actor-1');
    });

    it('passes through role and type', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
        basePayload,
        recipient
      );

      expect(result.role).toBe('GLOBAL_ADMIN');
      expect(result.type).toBe(RoleChangeType.ADDED);
    });

    it('sets triggeredBy to the actor id', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformGlobalRoleChange(
        basePayload,
        recipient
      );

      expect(result.triggeredBy).toBe('actor-1');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserSignUpWelcome
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserSignUpWelcome', () => {
    const basePayload: NotificationEventPayloadPlatformUserRegistration = {
      eventType: 'PlatformUserRegistration',
      triggeredBy: registeredUser,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: registeredUser,
    };

    it('maps registrant from event payload user', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserSignUpWelcome(
        basePayload,
        recipient
      );

      expect(result.registrant.displayName).toBe('New User');
      expect(result.registrant.firstName).toBe('New');
      expect(result.registrant.email).toBe('newuser@example.com');
      expect(result.registrant.profile).toBe(
        'https://alkemio.dev/users/new-user-1'
      );
    });

    it('includes platform URL in base fields', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserSignUpWelcome(
        basePayload,
        recipient
      );

      expect(result.platform.url).toBe('https://alkemio.dev');
    });

    it('returns empty notificationPreferences when recipient has no id (PlatformUser)', () => {
      const service = createService();
      const platformUser = {
        firstName: 'External',
        lastName: 'User',
        email: 'external@example.com',
      } as unknown as User;

      const result = service.createEmailTemplatePayloadUserSignUpWelcome(
        basePayload,
        platformUser
      );

      expect(result.recipient.notificationPreferences).toBe('');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadPlatformAdminUserProfileCreated
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadPlatformAdminUserProfileCreated', () => {
    const basePayload: NotificationEventPayloadPlatformUserRegistration = {
      eventType: 'PlatformUserRegistration',
      triggeredBy: registeredUser,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: registeredUser,
    };

    it('produces the same registrant as the welcome variant', () => {
      const service = createService();
      const welcomeResult = service.createEmailTemplatePayloadUserSignUpWelcome(
        basePayload,
        recipient
      );
      const adminResult =
        service.createEmailTemplatePayloadPlatformAdminUserProfileCreated(
          basePayload,
          recipient
        );

      expect(adminResult.registrant).toEqual(welcomeResult.registrant);
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadPlatformUserRemoved
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadPlatformUserRemoved', () => {
    const basePayload: NotificationEventPayloadPlatformUserRemoved = {
      eventType: 'PlatformUserRemoved',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: {
        displayName: 'Removed User',
        email: 'removed@example.com',
      },
    };

    it('maps registrant displayName and email from event payload user', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadPlatformUserRemoved(
        basePayload,
        recipient
      );

      expect(result.registrant.displayName).toBe('Removed User');
      expect(result.registrant.email).toBe('removed@example.com');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadPlatformForumDiscussionComment
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadPlatformForumDiscussionComment', () => {
    const baseDiscussion = {
      id: 'disc-1',
      displayName: 'Feature Requests',
      createdBy: discussionCreator,
      url: 'https://alkemio.dev/forum/disc-1',
    };

    const baseComment = {
      message: 'Great idea!',
      createdBy: commentCreator,
      url: 'https://alkemio.dev/forum/disc-1/comment-1',
    };

    const basePayload: NotificationEventPayloadPlatformForumDiscussion = {
      eventType: 'PlatformForumDiscussionComment',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      discussion: baseDiscussion,
      comment: baseComment,
    };

    it('maps comment message and createdBy id', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformForumDiscussionComment(
          basePayload,
          recipient
        );

      expect(result.comment.message).toBe('Great idea!');
      expect(result.comment.createdBy).toBe('comment-creator-1');
    });

    it('maps discussion displayName, createdBy id and url', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformForumDiscussionComment(
          basePayload,
          recipient
        );

      expect(result.discussion.displayName).toBe('Feature Requests');
      expect(result.discussion.createdBy).toBe('disc-creator-1');
      expect(result.discussion.url).toBe('https://alkemio.dev/forum/disc-1');
    });

    it('throws EventPayloadNotProvidedException when comment is missing', () => {
      const service = createService();
      const payloadWithoutComment: NotificationEventPayloadPlatformForumDiscussion =
        {
          ...basePayload,
          comment: undefined,
        };

      expect(() =>
        service.createEmailTemplatePayloadPlatformForumDiscussionComment(
          payloadWithoutComment,
          recipient
        )
      ).toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadPlatformForumDiscussionCreated
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadPlatformForumDiscussionCreated', () => {
    const baseDiscussion = {
      id: 'disc-1',
      displayName: 'Feature Requests',
      createdBy: discussionCreator,
      url: 'https://alkemio.dev/forum/disc-1',
    };

    const basePayload: NotificationEventPayloadPlatformForumDiscussion = {
      eventType: 'PlatformForumDiscussionCreated',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      discussion: baseDiscussion,
    };

    it('maps createdBy firstName from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformForumDiscussionCreated(
          basePayload,
          recipient
        );

      expect(result.createdBy.firstName).toBe('Alice');
    });

    it('maps discussion displayName and url', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformForumDiscussionCreated(
          basePayload,
          recipient
        );

      expect(result.discussion.displayName).toBe('Feature Requests');
      expect(result.discussion.url).toBe('https://alkemio.dev/forum/disc-1');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadPlatformAdminSpaceCreated
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadPlatformAdminSpaceCreated', () => {
    const created = new Date('2025-03-01T08:30:00.000Z').getTime();

    const basePayload: NotificationEventPayloadPlatformSpaceCreated = {
      eventType: 'PlatformSpaceCreated',
      triggeredBy: actor,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      created,
      sender: {
        name: 'Alice Actor',
        url: 'https://alkemio.dev/users/actor-1',
      },
    };

    it('passes through sender as-is', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformAdminSpaceCreated(
          basePayload,
          recipient
        );

      expect(result.sender.name).toBe('Alice Actor');
      expect(result.sender.url).toBe('https://alkemio.dev/users/actor-1');
    });

    it('formats dateCreated from created timestamp', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformAdminSpaceCreated(
          basePayload,
          recipient
        );

      expect(result.dateCreated).toMatch(/2025/);
      expect(result.dateCreated).toMatch(/03|March|Mar/);
    });

    it('includes space displayName', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadPlatformAdminSpaceCreated(
          basePayload,
          recipient
        );

      expect(result.space.displayName).toBe('Solaris Lab');
    });
  });
});
