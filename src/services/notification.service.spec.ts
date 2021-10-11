import { NotificationService } from './notification.service';
import { Test } from '@nestjs/testing';
import NotifMeSdk, { NotificationStatus } from 'notifme-sdk';

describe('AppController', () => {
  let notificationService: NotificationService;
  let notifmeSDK: NotifMeSdk;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);
  });

  describe('sendNotification', () => {
    it('Should send notification', async () => {
      const result: NotificationStatus = {
        status: 'success',
      };
      const data = {
        emailFrom: 'info@alkem.io',
        user: {
          firstname: 'Valentin',
          email: 'valentin@alkem.io',
        },
      };

      jest
        .spyOn(notifmeSDK, 'send')
        .mockImplementation(() => Promise.resolve(result));

      expect(await notificationService.sendNotification(data)).toBe(result);
    });
  });
});
