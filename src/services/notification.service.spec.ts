import { NotificationService } from './notification.service';
import { Test } from '@nestjs/testing';
import { WinstonConfigService } from '@src/config';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@src/config/configuration';
import { NotifmeModule } from '@src/wrappers/notifme.module';

const data = {
  emailFrom: 'info@alkem.io',
  user: {
    firstname: 'Valentin',
    email: 'valentin@alkem.io',
  },
};

describe('AppController', () => {
  let notificationService: NotificationService;
  // let notifmeSDK: NotifMeSdk;
  // let notificationTemplateService: NotificationTemplateService;

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
    // notifmeSDK = moduleRef.get<NotifMeSdk>(NOTIFICATIONS_PROVIDER);
    // notificationTemplateService =
    //   moduleRef.get<NotificationTemplateService>(TEMPLATE_PROVIDER);
  });

  describe('sendNotification', () => {
    it('Should send notification', async () => {
      const res = await notificationService.sendNotification(data);
      expect(res.status).toBe('success');
    });
  });

  //vyanakiev toDo - add more tests

  // it('Should throw error', async () => {
  //   jest
  //     .spyOn(notificationTemplateService, 'renderTemplate')
  //     .mockImplementation(() => Promise.reject());

  //   expect(await notificationService.sendNotification(data)).toThrow();
  // });
});
