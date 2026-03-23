import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import {
  NotificationEventPayloadSpaceCommunicationUpdate,
  NotificationEventPayloadUserMessageDirect,
  NotificationEventPayloadOrganizationMessageDirect,
  NotificationEventPayloadOrganizationMessageRoom,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadUserMessageRoom,
  NotificationEventPayloadUserMessageRoomReply,
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

const sender = {
  id: 'sender-1',
  firstName: 'Sam',
  lastName: 'Sender',
  email: 'sam@example.com',
  type: 'USER',
  profile: {
    displayName: 'Sam Sender',
    url: 'https://alkemio.dev/users/sender-1',
  },
};

const targetUser = {
  id: 'target-1',
  firstName: 'Tom',
  lastName: 'Target',
  email: 'tom@example.com',
  type: 'USER',
  profile: {
    displayName: 'Tom Target',
    url: 'https://alkemio.dev/users/target-1',
  },
};

const organization = {
  id: 'org-1',
  type: 'ORGANIZATION',
  profile: {
    displayName: 'Acme Corp',
    url: 'https://alkemio.dev/organizations/acme',
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

const commentOrigin = {
  url: 'https://alkemio.dev/spaces/solaris/discussion',
  displayName: 'Solaris Lab Discussion',
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

describe('NotificationEmailPayloadBuilderService — communication notifications', () => {
  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCommunicationUpdate
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCommunicationUpdate', () => {
    const updateContributor = {
      id: 'updater-1',
      type: 'USER',
      profile: {
        displayName: 'Update Creator',
        url: 'https://alkemio.dev/users/updater-1',
      },
    };

    const basePayload: NotificationEventPayloadSpaceCommunicationUpdate = {
      eventType: 'SpaceCommunityUpdateSent',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      space: baseSpace,
      update: {
        id: 'update-1',
        createdBy: updateContributor,
        url: 'https://alkemio.dev/spaces/solaris/updates/1',
      },
      message: '**Hello** world',
    };

    it('maps sender firstName from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCommunicationUpdate(
        basePayload,
        recipient
      );

      expect(result.sender.firstName).toBe('Sam');
    });

    it('converts markdown message to HTML', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCommunicationUpdate(
        basePayload,
        recipient
      );

      // Markdown bold should be converted to HTML <strong> or <b>
      expect(result.message).toContain('Hello');
      expect(result.message).not.toBe('**Hello** world');
    });

    it('uses empty string for missing message', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCommunicationUpdate(
        { ...basePayload, message: undefined },
        recipient
      );

      expect(result.message).toBe('');
    });

    it('includes space displayName', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadSpaceCommunicationUpdate(
        basePayload,
        recipient
      );

      expect(result.space.displayName).toBe('Solaris Lab');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserMessage
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserMessage', () => {
    const basePayload: NotificationEventPayloadUserMessageDirect = {
      eventType: 'UserMessageDirect',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: targetUser,
      message: 'Hello, how are you?',
    };

    it('maps messageSender from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMessage(
        basePayload,
        recipient
      );

      expect(result.messageSender.displayName).toBe('Sam Sender');
      expect(result.messageSender.firstName).toBe('Sam');
      expect(result.messageSender.email).toBe('sam@example.com');
    });

    it('maps messageReceiver from user payload', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMessage(
        basePayload,
        recipient
      );

      expect(result.messageReceiver.displayName).toBe('Tom Target');
      expect(result.messageReceiver.firstName).toBe('Tom');
    });

    it('passes through the message text', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMessage(
        basePayload,
        recipient
      );

      expect(result.message).toBe('Hello, how are you?');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserMessageSender
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserMessageSender', () => {
    const basePayload: NotificationEventPayloadUserMessageDirect = {
      eventType: 'UserMessageDirect',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: targetUser,
      message: 'Hello, how are you?',
    };

    it('contains the same messageSender and messageReceiver as the recipient variant', () => {
      const service = createService();
      const senderResult = service.createEmailTemplatePayloadUserMessageSender(
        basePayload,
        recipient
      );
      const recipientResult = service.createEmailTemplatePayloadUserMessage(
        basePayload,
        recipient
      );

      expect(senderResult.messageSender).toEqual(recipientResult.messageSender);
      expect(senderResult.messageReceiver).toEqual(
        recipientResult.messageReceiver
      );
    });

    it('passes through the message text', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMessageSender(
        basePayload,
        recipient
      );

      expect(result.message).toBe('Hello, how are you?');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadOrganizationMessage
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadOrganizationMessage', () => {
    const basePayload: NotificationEventPayloadOrganizationMessageDirect = {
      eventType: 'OrganizationMessageDirect',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      organization,
      message: 'Org message here',
    };

    it('maps messageSender from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMessage(
        basePayload,
        recipient
      );

      expect(result.messageSender.displayName).toBe('Sam Sender');
      expect(result.messageSender.firstName).toBe('Sam');
      expect(result.messageSender.email).toBe('sam@example.com');
    });

    it('maps organization displayName', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMessage(
        basePayload,
        recipient
      );

      expect(result.organization.displayName).toBe('Acme Corp');
    });

    it('passes through the message', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMessage(
        basePayload,
        recipient
      );

      expect(result.message).toBe('Org message here');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadOrganizationMessageSender
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadOrganizationMessageSender', () => {
    const basePayload: NotificationEventPayloadOrganizationMessageDirect = {
      eventType: 'OrganizationMessageDirect',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      organization,
      message: 'Org message here',
    };

    it('produces the same payload shape as the recipient variant', () => {
      const service = createService();
      const senderResult =
        service.createEmailTemplatePayloadOrganizationMessageSender(
          basePayload,
          recipient
        );
      const recipientResult =
        service.createEmailTemplatePayloadOrganizationMessage(
          basePayload,
          recipient
        );

      expect(senderResult.messageSender).toEqual(recipientResult.messageSender);
      expect(senderResult.organization).toEqual(recipientResult.organization);
      expect(senderResult.message).toBe(recipientResult.message);
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadOrganizationMention
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadOrganizationMention', () => {
    const basePayload: NotificationEventPayloadOrganizationMessageRoom = {
      eventType: 'OrganizationMention',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      organization,
      comment: 'Hey **@Acme Corp** check this out',
      commentOrigin,
    };

    it('maps commentSender from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMention(
        basePayload,
        recipient
      );

      expect(result.commentSender.displayName).toBe('Sam Sender');
      expect(result.commentSender.firstName).toBe('Sam');
    });

    it('converts comment markdown to plain text', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMention(
        basePayload,
        recipient
      );

      // Markdown bold should be stripped
      expect(result.comment).toContain('Acme Corp');
      expect(result.comment).not.toContain('**');
    });

    it('maps mentionedOrganization displayName', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMention(
        basePayload,
        recipient
      );

      expect(result.mentionedOrganization.displayName).toBe('Acme Corp');
    });

    it('maps commentOrigin url and displayName', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadOrganizationMention(
        basePayload,
        recipient
      );

      expect(result.commentOrigin.url).toBe(
        'https://alkemio.dev/spaces/solaris/discussion'
      );
      expect(result.commentOrigin.displayName).toBe('Solaris Lab Discussion');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceCommunicationMessage
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadSpaceCommunicationMessage', () => {
    const basePayload: NotificationEventPayloadSpaceCommunicationMessageDirect =
      {
        eventType: 'SpaceCommunicationMessage',
        triggeredBy: sender,
        recipients: [recipientPayload],
        platform: basePlatform,
        space: baseSpace,
        message: 'Direct space message',
      };

    it('maps messageSender from triggeredBy', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunicationMessage(
          basePayload,
          recipient
        );

      expect(result.messageSender.displayName).toBe('Sam Sender');
      expect(result.messageSender.firstName).toBe('Sam');
      expect(result.messageSender.email).toBe('sam@example.com');
    });

    it('passes through the message text', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunicationMessage(
          basePayload,
          recipient
        );

      expect(result.message).toBe('Direct space message');
    });

    it('includes space info in the payload', () => {
      const service = createService();
      const result =
        service.createEmailTemplatePayloadSpaceCommunicationMessage(
          basePayload,
          recipient
        );

      expect(result.space.displayName).toBe('Solaris Lab');
      expect(result.space.type).toBe('space');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserMention
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserMention', () => {
    const basePayload: NotificationEventPayloadUserMessageRoom = {
      eventType: 'UserMention',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: targetUser,
      comment: 'Hey **@Rita** take a look!',
      commentOrigin,
    };

    it('maps commentSender from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMention(
        basePayload,
        recipient
      );

      expect(result.commentSender.displayName).toBe('Sam Sender');
      expect(result.commentSender.firstName).toBe('Sam');
    });

    it('converts comment markdown to plain text', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMention(
        basePayload,
        recipient
      );

      expect(result.comment).toContain('Rita');
      expect(result.comment).not.toContain('**');
    });

    it('maps commentOrigin url and displayName', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserMention(
        basePayload,
        recipient
      );

      expect(result.commentOrigin.url).toBe(
        'https://alkemio.dev/spaces/solaris/discussion'
      );
      expect(result.commentOrigin.displayName).toBe('Solaris Lab Discussion');
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadUserCommentReply
  // -------------------------------------------------------------------------
  describe('createEmailTemplatePayloadUserCommentReply', () => {
    const basePayload: NotificationEventPayloadUserMessageRoomReply = {
      eventType: 'UserCommentReply',
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: basePlatform,
      user: targetUser,
      reply: 'That is a great point!',
      comment: {
        commentOwnerId: 'owner-1',
        commentUrl: 'https://alkemio.dev/comments/42',
        commentOrigin: 'https://alkemio.dev/spaces/solaris/discussion',
      },
    };

    it('maps reply message and createdBy from triggeredBy', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserCommentReply(
        basePayload,
        recipient
      );

      expect(result.reply.message).toBe('That is a great point!');
      expect(result.reply.createdBy).toBe('Sam Sender');
      expect(result.reply.createdByUrl).toBe(
        'https://alkemio.dev/users/sender-1'
      );
    });

    it('passes through the original comment url and origin', () => {
      const service = createService();
      const result = service.createEmailTemplatePayloadUserCommentReply(
        basePayload,
        recipient
      );

      expect(result.comment.commentUrl).toBe('https://alkemio.dev/comments/42');
      expect(result.comment.commentOrigin).toBe(
        'https://alkemio.dev/spaces/solaris/discussion'
      );
    });
  });
});
