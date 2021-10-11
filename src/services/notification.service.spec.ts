import { NotificationService } from './notification.service';
import { Test } from '@nestjs/testing';
import NotifMeSdk, { NotificationStatus } from 'notifme-sdk';
import { WinstonConfigService } from '@src/config';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@src/config/configuration';
import { NotifmeModule } from '@src/wrappers/notifme.module';
import { NOTIFICATIONS } from '@common/enums';

describe('AppController', () => {
  let notificationService: NotificationService;
  let notifmeSDK: NotifMeSdk;

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
      ],
      providers: [NotificationService, ConfigService],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);
    notifmeSDK = moduleRef.get<NotifMeSdk>(NOTIFICATIONS);
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
