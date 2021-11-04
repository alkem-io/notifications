import { Test } from '@nestjs/testing';
import { WinstonConfigService } from '@src/config';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@src/config/configuration';
import { NotifmeModule } from '@src/wrappers/notifme/notifme.module';
import { ALKEMIO_CLIENT_ADAPTER } from '@src/common';
import * as challengeAdminsData from '@test/data/challenge.admins.json';
import * as opportunityAdminsData from '@test/data/opportunity.admins.json';
import * as hubAdminsData from '@test/data/hub.admins.json';
import * as eventPayload from '@test/data/event.payload.json';
import * as adminUser from '@test/data/admin.user.json';
import { INotifiedUsersProvider } from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types';
import { NotificationStatus } from 'notifme-sdk';
import { NotificationService } from './notification.service';
import { ApplicationNotificationBuilder } from '../application-notification-builder/application.notification.builder';
import {
  TemplateToCredentialMapper,
  NotificationRecipientsYmlAdapter,
} from '@src/services';
import { NotificationRecipientsAdapterModule } from '../notification-recipients-adapter/notification.recipients.adapter.module';

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
        TemplateToCredentialMapper,
        NotificationRecipientsYmlAdapter,
        NotificationService,
        ApplicationNotificationBuilder,
        ConfigService,
        {
          provide: ALKEMIO_CLIENT_ADAPTER,
          useValue: {
            getApplicant: jest.fn(),
            getApplicationCreator: jest.fn(),
            getOpportunityAdmins: jest.fn(),
            getHubAdmins: jest.fn(),
            getChallengeAdmins: jest.fn(),
            getUsersWithCredentials: jest.fn(),
          },
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
      jest
        .spyOn(alkemioAdapter, 'getUsersWithCredentials')
        .mockResolvedValue(testData.hubAdmins);

      jest
        .spyOn(alkemioAdapter, 'getApplicant')
        .mockResolvedValue(testData.adminUser);

      jest
        .spyOn(alkemioAdapter, 'getHubAdmins')
        .mockResolvedValue(testData.hubAdmins);

      jest
        .spyOn(alkemioAdapter, 'getChallengeAdmins')
        .mockResolvedValue(testData.challengeAdmins);

      jest
        .spyOn(alkemioAdapter, 'getOpportunityAdmins')
        .mockResolvedValue(testData.opportunityAdmins);

      const res = await notificationService.sendApplicationNotifications(
        testData.eventPayload.data as ApplicationCreatedEventPayload
      );
      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }
    });

    it('Should fail to send notification', async () => {
      jest
        .spyOn(alkemioAdapter, 'getApplicant')
        .mockRejectedValue(new Error('Applicant not found!'));
      expect(
        notificationService.sendApplicationNotifications(
          testData.eventPayload.data as ApplicationCreatedEventPayload
        )
      ).rejects.toThrow();
    });
  });
});
