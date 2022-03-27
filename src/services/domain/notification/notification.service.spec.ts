import { Test } from '@nestjs/testing';
import { WinstonConfigService } from '@src/config';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@src/config/configuration';
import { NotifmeModule } from '@src/services/external/notifme/notifme.module';
import { ALKEMIO_CLIENT_ADAPTER, ALKEMIO_URL_GENERATOR } from '@src/common';
import * as challengeAdminsData from '@test/data/challenge.admins.json';
import * as opportunityAdminsData from '@test/data/opportunity.admins.json';
import * as hubAdminsData from '@test/data/hub.admins.json';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import * as adminUser from '@test/data/admin.user.json';
import { INotifiedUsersProvider } from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types';
import { NotificationStatus } from 'notifme-sdk';
import { NotificationService } from './notification.service';
import { ApplicationCreatedNotificationBuilder } from '@src/services';
import { NotificationRecipientsYmlAdapter } from '@src/services';
import { NotificationRecipientsAdapterModule } from '../../application/notification-recipients-adapter/notification.recipients.adapter.module';
import { UserRegisteredNotificationBuilder } from '../builders/user-registered/user.registered.notification.builder';
import { CommunicationUpdateNotificationBuilder } from '../builders/communication-updated/communication.updated.notification.builder';
import { CommunicationDiscussionCreatedNotificationBuilder } from '../builders/communication-discussion-created/communication.discussion.created.notification.builder';
import { AlkemioUrlGenerator } from '@src/services/application/alkemio-url-generator';
import { CommunityContextReviewSubmittedNotificationBuilder } from '../builders/community-context-feedback/community.context.review.submitted.notification.builder';

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

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          isGlobal: true,
          load: [configuration],
        }),
        WinstonModule.forRootAsync({
          useClass: WinstonConfigService,
        }),
        NotifmeModule,
        NotificationRecipientsAdapterModule,
      ],
      providers: [
        NotificationRecipientsYmlAdapter,
        NotificationService,
        ApplicationCreatedNotificationBuilder,
        UserRegisteredNotificationBuilder,
        CommunicationUpdateNotificationBuilder,
        CommunicationDiscussionCreatedNotificationBuilder,
        CommunityContextReviewSubmittedNotificationBuilder,
        ConfigService,
        {
          provide: ALKEMIO_CLIENT_ADAPTER,
          useValue: {
            areNotificationsEnabled: jest.fn(),
            getUser: jest.fn(),
            getApplicationCreator: jest.fn(),
            getUsersMatchingCredentialCriteria: jest.fn(),
            getUniqueUsersMatchingCredentialCriteria: jest.fn(),
          },
        },
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

      jest
        .spyOn(alkemioAdapter, 'areNotificationsEnabled')
        .mockResolvedValue(true);

      jest
        .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
        .mockResolvedValue(admins);

      jest
        .spyOn(alkemioAdapter, 'getUser')
        .mockResolvedValue(testData.adminUser);

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

    it('Should fail to send notification', async () => {
      jest
        .spyOn(alkemioAdapter, 'getUser')
        .mockRejectedValue(new Error('Applicant not found!'));
      expect(
        notificationService.sendApplicationCreatedNotifications(
          testData.data as ApplicationCreatedEventPayload
        )
      ).rejects.toThrow();
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
