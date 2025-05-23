import { Test } from '@nestjs/testing';
import { CommunityApplicationCreatedEventPayload } from '@alkemio/notifications-lib';
import { ALKEMIO_CLIENT_ADAPTER, NOTIFICATIONS_PROVIDER } from '@common/enums';
import * as spaceAdminsL1Data from '@test/data/space.admins.l1.json';
import * as spaceAdminsL2Data from '@test/data/space.admins.l2.json';
import * as spaceAdminsL0Data from '@test/data/space.admins.l0.json';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import * as adminUser from '@test/data/admin.user.json';
import { INotifiedUsersProvider } from '@core/contracts';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { NotificationService } from './notification.service';
import { CommunityApplicationCreatedNotificationBuilder } from '@src/services';
import { NotificationRecipientsYmlAdapter } from '@src/services';
import {
  PlatformUserRegisteredNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  PlatformForumDiscussionCreatedNotificationBuilder,
  CommunicationUserMessageNotificationBuilder,
  CommunicationOrganizationMessageNotificationBuilder,
  CommunicationCommunityLeadsMessageNotificationBuilder,
  CommunicationUserMentionNotificationBuilder,
  CommunicationOrganizationMentionNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CollaborationPostCreatedNotificationBuilder,
  CollaborationPostCommentNotificationBuilder,
  CollaborationCalloutPublishedNotificationBuilder,
  PlatformUserRemovedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  CommunityInvitationCreatedNotificationBuilder,
  CommentReplyNotificationBuilder,
  CommunityPlatformInvitationCreatedNotificationBuilder,
} from '../builders';
import {
  MockAlkemioClientAdapterProvider,
  MockConfigServiceProvider,
  MockNotificationBuilderProvider,
  MockNotificationRecipientsYmlProvider,
  MockNotifmeProvider,
  MockWinstonProvider,
} from '@test/mocks';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { CollaborationWhiteboardCreatedNotificationBuilder } from '../builders/collaboration-whiteboard-created/collaboration.whiteboard.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from '../builders/collaboration-discussion-comment/collaboration.discussion.comment.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from '../builders/platform-global-role-change/platform.global.role.change.notification.builder';
import { CommunityInvitationVirtualContributorCreatedNotificationBuilder } from '../builders/community-invitation-virtual-contributor-created/community.invitation.virtual.contributor.created.notification.builder';
import { SpaceCreatedNotificationBuilder } from '../builders/space-created/space.created.notification.builder';

const testData = {
  ...spaceAdminsL0Data,
  ...spaceAdminsL1Data,
  ...spaceAdminsL2Data,
  ...eventPayload,
  ...adminUser,
};

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let alkemioAdapter: INotifiedUsersProvider;
  let notificationBuilder: NotificationBuilder<any, any>;
  let notifmeService: NotifmeSdk;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        MockNotifmeProvider,
        MockWinstonProvider,
        MockNotificationRecipientsYmlProvider,
        NotificationRecipientsYmlAdapter,
        NotificationService,
        CommunityApplicationCreatedNotificationBuilder,
        CommunityInvitationCreatedNotificationBuilder,
        CommunityPlatformInvitationCreatedNotificationBuilder,
        PlatformUserRegisteredNotificationBuilder,
        PlatformForumDiscussionCommentNotificationBuilder,
        PlatformUserRemovedNotificationBuilder,
        CommunicationUpdateCreatedNotificationBuilder,
        PlatformForumDiscussionCreatedNotificationBuilder,
        CommunicationUserMessageNotificationBuilder,
        CommunicationOrganizationMessageNotificationBuilder,
        CommunicationCommunityLeadsMessageNotificationBuilder,
        CommunicationUserMentionNotificationBuilder,
        CommunicationOrganizationMentionNotificationBuilder,
        CommunityNewMemberNotificationBuilder,
        CollaborationWhiteboardCreatedNotificationBuilder,
        CollaborationPostCreatedNotificationBuilder,
        CollaborationPostCommentNotificationBuilder,
        CollaborationDiscussionCommentNotificationBuilder,
        CollaborationCalloutPublishedNotificationBuilder,
        CommentReplyNotificationBuilder,
        PlatformGlobalRoleChangeNotificationBuilder,
        CommunityInvitationVirtualContributorCreatedNotificationBuilder,
        MockNotificationBuilderProvider,
        MockConfigServiceProvider,
        MockAlkemioClientAdapterProvider,
        AlkemioUrlGenerator,
        SpaceCreatedNotificationBuilder,
      ],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);
    alkemioAdapter = moduleRef.get<INotifiedUsersProvider>(
      ALKEMIO_CLIENT_ADAPTER
    );
    notificationBuilder = moduleRef.get(NotificationBuilder);
    notifmeService = moduleRef.get(NOTIFICATIONS_PROVIDER);
  });

  beforeEach(() => {
    jest
      .spyOn(alkemioAdapter, 'areNotificationsEnabled')
      .mockResolvedValue(true);
  });

  describe('Application Notifications', () => {
    it('Should send application notification', async () => {
      //toDo investigate mocking this function result based on input arguments https://stackoverflow.com/questions/41697513/can-i-mock-functions-with-specific-arguments-using-jest
      jest
        .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
        .mockResolvedValue(testData.spaceAdminsL0);

      jest
        .spyOn(alkemioAdapter, 'getUser')
        .mockResolvedValue(testData.adminUser);

      jest
        .spyOn(notificationBuilder, 'build')
        .mockResolvedValue(generateNotificationTemplate(1));

      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      const res = await notificationService.sendApplicationCreatedNotifications(
        testData.data as CommunityApplicationCreatedEventPayload
      );
      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }
    });

    it('Should send 6 application notifications', async () => {
      const admins = [
        ...testData.spaceAdminsL0,
        ...testData.spaceAdminsL1,
        ...testData.spaceAdminsL2,
      ];

      const applicationCount = 6;

      jest
        .spyOn(alkemioAdapter, 'areNotificationsEnabled')
        .mockResolvedValue(true);

      jest
        .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
        .mockResolvedValue(admins);

      jest
        .spyOn(alkemioAdapter, 'getUser')
        .mockResolvedValue(testData.adminUser);

      jest
        .spyOn(notificationBuilder, 'build')
        .mockResolvedValue(generateNotificationTemplate(applicationCount));

      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      const res = await notificationService.sendApplicationCreatedNotifications(
        testData.data as CommunityApplicationCreatedEventPayload
      );

      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }

      expect(res.length).toBe(6); //based on the template. toDo Mock the configuration
    });

    it('Should not send notifications when notifications are disabled', async () => {
      jest
        .spyOn(alkemioAdapter, 'areNotificationsEnabled')
        .mockResolvedValue(false);

      const res = await notificationService.sendApplicationCreatedNotifications(
        testData.data as CommunityApplicationCreatedEventPayload
      );

      expect(res.length).toBe(0); //shouldn't have any notifications sent
    });
  });
});

const generateNotificationTemplate = (
  amount: number
): NotificationTemplateType[] =>
  new Array(amount).fill(null).map((_, i) => ({
    name: `template${i}`,
    title: `title${i}`,
    version: 1,
    channels: {
      email: {
        to: `to${i}@email`,
        from: 'from@email',
        subject: `subject${i}`,
      },
    },
  }));
