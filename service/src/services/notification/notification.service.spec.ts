import { Test } from '@nestjs/testing';
import * as spaceAdminsL1Data from '@test/data/space.admins.l1.json';
import * as spaceAdminsL2Data from '@test/data/space.admins.l2.json';
import * as spaceAdminsL0Data from '@test/data/space.admins.l0.json';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import * as adminUser from '@test/data/admin.user.json';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import {
  MockConfigServiceProvider,
  MockNotifmeProvider,
  MockWinstonProvider,
} from '@test/mocks';
import { NotificationEventPayloadSpaceCommunityApplication } from '@alkemio/notifications-lib';
import { NotificationTemplateBuilder } from '@src/services/notifme';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { NOTIFICATIONS_PROVIDER } from '@src/common/enums/providers';

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
        NotificationEmailPayloadBuilderService,
        MockConfigServiceProvider,
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

      const res = await notificationService.processNotificationEvent(
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

      const res = await notificationService.processNotificationEvent(
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
