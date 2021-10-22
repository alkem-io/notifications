import { NotificationService } from './notification.service';
import { Test } from '@nestjs/testing';
import { WinstonConfigService } from '@src/config';
import { WinstonModule } from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@src/config/configuration';
import { NotifmeModule } from '@src/wrappers/notifme/notifme.module';
import { ApplicationNotificationBuilder } from './application.notification.builder';
import { INotifiedUsersProvider, IUser } from '@src/types';
import { ALKEMIO_CLIENT_ADAPTER } from '@src/common';

const data = {
  pattern: {
    event: 'userApplicationReceived',
  },
  data: {
    applicantionCreatorID: 'f0a47bad-eca5-4942-84ac-4dc9f085b7b8',
    applicantID: 'f0a47bad-eca5-4942-84ac-4dc9f085b7b8',
    community: {
      name: '02 Zero Hunger',
      type: 'challenge',
    },
    hub: {
      id: '32818605-ef2f-4395-bb49-1dc2835c23de',
      challenge: {
        id: '7b86f954-d8c3-4fac-a652-b922c80e5c20',
        opportunity: {
          id: '636be60f-b64a-4742-8b50-69e608601935',
        },
      },
    },
  },
};

const adminUser = {
  id: 'f0a47bad-eca5-4942-84ac-4dc9f085b7b8',
  nameID: 'admin_alkemio',
  displayName: 'admin alkemio',
  firstName: 'admin',
  lastName: 'alkemio',
  email: 'admin@alkem.io',
};

const hubAdmins: IUser[] | Promise<IUser[]> = [];
const challengeAdmins = [
  {
    id: 'd2c354a9-afad-4e4d-9969-cba1a925b302',
    nameID: 'madalynjerold',
    displayName: 'Madalyn Jerold',
    firstName: 'Madalyn',
    lastName: 'Jerold',
    email: 'Madalyn@Jerold.com',
  },
];

const opportunityAdmins = [
  {
    id: '3f31a980-527d-41dd-94d0-e7f3412c0966',
    nameID: 'kathernkeira',
    displayName: 'Kathern Keira',
    firstName: 'Kathern',
    lastName: 'Keira',
    email: 'Kathern@Keira.com',
  },
];
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
      ],
      providers: [
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
      jest.spyOn(alkemioAdapter, 'getApplicant').mockResolvedValue(adminUser);

      jest.spyOn(alkemioAdapter, 'getHubAdmins').mockResolvedValue(hubAdmins);

      jest
        .spyOn(alkemioAdapter, 'getChallengeAdmins')
        .mockResolvedValue(challengeAdmins);

      jest
        .spyOn(alkemioAdapter, 'getOpportunityAdmins')
        .mockResolvedValue(opportunityAdmins);

      const res = await notificationService.sendApplicationNotifications(
        data.data
      );
      for (const notificationStatus of res) {
        expect(notificationStatus.status).toBe('success');
      }
    });

    it('Should fail to send notification', async () => {
      jest
        .spyOn(alkemioAdapter, 'getApplicant')
        .mockRejectedValue(new Error('Applicant not found!'));
      expect(
        notificationService.sendApplicationNotifications(data.data)
      ).rejects.toThrow();
    });
  });
});
