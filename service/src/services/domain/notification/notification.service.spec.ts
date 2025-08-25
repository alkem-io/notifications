import { Test } from '@nestjs/testing';
import { NOTIFICATIONS_PROVIDER } from '@common/enums';
import * as spaceAdminsL1Data from '@test/data/space.admins.l1.json';
import * as spaceAdminsL2Data from '@test/data/space.admins.l2.json';
import * as spaceAdminsL0Data from '@test/data/space.admins.l0.json';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import * as adminUser from '@test/data/admin.user.json';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import {
  PlatformUserRegisteredNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  SpaceCommunicationMessageDirectRecipientNotificationBuilder,
  UserMentionNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  SpaceCommunityNewMemberNotificationBuilder,
  SpaceCollaborationPostCreatedMemberNotificationBuilder,
  SpaceCollaborationPostCommentNotificationBuilder,
  SpaceCollaborationCalloutPublishedNotificationBuilder,
  PlatformUserRemovedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  USERSpaceCommunityInvitationReceivedNotificationBuilder,
  UserCommentReplyNotificationBuilder,
  SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
  SpaceCommunicationUpdateMemberNotificationBuilder,
  OrganizationMessageRecipientNotificationBuilder,
  UserMessageRecipientNotificationBuilder,
  SpaceCommunityApplicationApplicantNotificationBuilder,
  SpaceCommunityApplicationCreatedAdminNotificationBuilder,
  SpaceCommunicationUpdateAdminNotificationBuilder,
  SpaceCommunityNewMemberAdminNotificationBuilder,
  OrganizationMessageSenderNotificationBuilder,
  UserMessageSenderNotificationBuilder,
} from '../builders';
import {
  MockConfigServiceProvider,
  MockNotifmeProvider,
  MockWinstonProvider,
} from '@test/mocks';
import { SpaceCollaborationWhiteboardCreatedNotificationBuilder } from '../builders/space/space.collaboration.callout.comment.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from '../builders/platform/platform.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/virtual-contributor/virtual.contributor.space.community.invitation.received.notification.builder';
import { PlatformSpaceCreatedNotificationBuilder } from '../builders/platform/platform.space.created.notification.builder';
import { NotificationEventPayloadSpaceCommunityApplication } from '@alkemio/notifications-lib';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from '../builders/space/space.communication.message.direct.sender.notification.builder';
import { PlatformUserRegisteredAdminNotificationBuilder } from '../builders/platform/platform.user.registered.admin.notification.builder';
import { NotificationTemplateBuilder } from '@src/services/external/notifme';

const testData = {
  ...spaceAdminsL0Data,
  ...spaceAdminsL1Data,
  ...spaceAdminsL2Data,
  ...eventPayload,
  ...adminUser,
};

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notifmeService: NotifmeSdk;
  let configService: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        MockNotifmeProvider,
        MockWinstonProvider,
        NotificationService,
        PlatformUserRegisteredNotificationBuilder,
        PlatformForumDiscussionCommentNotificationBuilder,
        PlatformUserRegisteredAdminNotificationBuilder,
        PlatformUserRemovedNotificationBuilder,
        PlatformForumDiscussionCreatedNotificationBuilder,
        PlatformGlobalRoleChangeNotificationBuilder,
        PlatformSpaceCreatedNotificationBuilder,
        OrganizationMessageRecipientNotificationBuilder,
        OrganizationMessageSenderNotificationBuilder,
        OrganizationMentionNotificationBuilder,
        USERSpaceCommunityInvitationReceivedNotificationBuilder,
        SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
        SpaceCommunityNewMemberNotificationBuilder,
        SpaceCommunityNewMemberAdminNotificationBuilder,
        SpaceCommunityApplicationApplicantNotificationBuilder,
        SpaceCommunityApplicationCreatedAdminNotificationBuilder,
        SpaceCommunicationUpdateMemberNotificationBuilder,
        SpaceCommunicationMessageDirectRecipientNotificationBuilder,
        SpaceCommunicationMessageDirectSenderNotificationBuilder,
        SpaceCommunicationUpdateAdminNotificationBuilder,
        SpaceCommunicationMessageDirectRecipientNotificationBuilder,
        SpaceCollaborationWhiteboardCreatedNotificationBuilder,
        SpaceCollaborationPostCreatedMemberNotificationBuilder,
        SpaceCollaborationPostCommentNotificationBuilder,
        SpaceCollaborationCalloutPublishedNotificationBuilder,
        SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
        MockConfigServiceProvider,
        UserCommentReplyNotificationBuilder,
        UserMentionNotificationBuilder,
        UserMessageSenderNotificationBuilder,
        UserMessageRecipientNotificationBuilder,
        NotificationTemplateBuilder,
      ],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);

    notifmeService = moduleRef.get(NOTIFICATIONS_PROVIDER);
    configService = moduleRef.get(ConfigService);
  });

  beforeEach(() => {
    // Mock the config service to return email configuration
    jest.spyOn(configService, 'get').mockImplementation((key: any) => {
      if (key === 'notification_providers') {
        return {
          email: {
            from: 'test@example.com',
            from_name: 'Test Notifications',
          },
        };
      }
      return undefined;
    });
  });

  describe('Application Notifications', () => {
    it('Should send application notification', async () => {
      // TODO: tests need work to be running

      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      const res =
        await notificationService.sendUserSpaceCommunityApplicationNotifications(
          testData.data as NotificationEventPayloadSpaceCommunityApplication
        );
      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }
    });

    it('Should send 3 application notifications', async () => {
      //const applicationCount = 6;

      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      const res =
        await notificationService.sendUserSpaceCommunityApplicationNotifications(
          testData.data as NotificationEventPayloadSpaceCommunityApplication
        );

      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }

      expect(res.length).toBe(3); //based on the template. toDo Mock the configuration
    });
  });
});
