import { Test } from '@nestjs/testing';
import { ApplicationCreatedEventPayload } from '@alkemio/notifications-lib';
import {
  ALKEMIO_CLIENT_ADAPTER,
  ALKEMIO_URL_GENERATOR,
  NOTIFICATIONS_PROVIDER,
} from '@common/enums';
import * as challengeAdminsData from '@test/data/challenge.admins.json';
import * as opportunityAdminsData from '@test/data/opportunity.admins.json';
import * as hubAdminsData from '@test/data/hub.admins.json';
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
  CommunicationDiscussionCreatedNotificationBuilder,
  CollaborationContextReviewSubmittedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CollaborationCardCreatedNotificationBuilder,
  CollaborationCardCommentNotificationBuilder,
  CCollaborationInterestNotificationBuilder,
  CollaborationCalloutPublishedNotificationBuilder,
} from '../builders';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import {
  MockAlkemioClientAdapterProvider,
  MockConfigServiceProvider,
  MockNotificationBuilderProvider,
  MockNotificationRecipientsYmlProvider,
  MockNotifmeProvider,
  MockWinstonProvider,
} from '@test/mocks';
import { NotificationBuilder } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';

const testData = {
  ...challengeAdminsData,
  ...opportunityAdminsData,
  ...hubAdminsData,
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
        PlatformUserRegisteredNotificationBuilder,
        CommunicationUpdateCreatedNotificationBuilder,
        CommunicationDiscussionCreatedNotificationBuilder,
        CollaborationContextReviewSubmittedNotificationBuilder,
        CommunityNewMemberNotificationBuilder,
        CCollaborationInterestNotificationBuilder,
        CollaborationCardCreatedNotificationBuilder,
        CollaborationCardCommentNotificationBuilder,
        CollaborationCalloutPublishedNotificationBuilder,
        MockNotificationBuilderProvider,
        MockConfigServiceProvider,
        MockAlkemioClientAdapterProvider,
        {
          provide: ALKEMIO_URL_GENERATOR,
          useClass: AlkemioUrlGenerator,
        },
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
        .mockResolvedValue(testData.hubAdmins);

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
        testData.data as ApplicationCreatedEventPayload
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
        ...testData.hubAdmins,
        ...testData.challengeAdmins,
        ...testData.opportunityAdmins,
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
        testData.data as ApplicationCreatedEventPayload
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
        testData.data as ApplicationCreatedEventPayload
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
