import { AlkemioClient } from '@alkemio/client-lib';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ALKEMIO_CLIENT_ADAPTER, ALKEMIO_CLIENT_PROVIDER } from '@src/common';
import { WinstonConfigService } from '@src/config';
import configuration from '@src/config/configuration';
import { IUser, INotifiedUsersProvider } from '@src/types';
import { WinstonModule } from 'nest-winston';
import { AlkemioClientAdapterModule } from './alkemio.client.adapter.module';
// import * as challengeAdmins from '@test/data/challenge.admins.json';

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

// const adminUser = {
//   id: 'f0a47bad-eca5-4942-84ac-4dc9f085b7b8',
//   nameID: 'admin_alkemio',
//   displayName: 'admin alkemio',
//   firstName: 'admin',
//   lastName: 'alkemio',
//   email: 'admin@alkem.io',
// };

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

const mockAlkemioClient = {
  usersWithAuthorizationCredential() {
    return {};
  },
  user() {
    return {};
  },
};

describe('AlkemioAdapter', () => {
  let alkemioAdapter: INotifiedUsersProvider;
  let alkemioClient: AlkemioClient;

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
        AlkemioClientAdapterModule,
      ],
      providers: [ConfigService],
    })
      .overrideProvider(ALKEMIO_CLIENT_PROVIDER)
      .useValue(mockAlkemioClient)
      .compile();

    alkemioAdapter = moduleRef.get<INotifiedUsersProvider>(
      ALKEMIO_CLIENT_ADAPTER
    );
    alkemioClient = moduleRef.get<AlkemioClient>(ALKEMIO_CLIENT_PROVIDER);
  });

  describe('Getting Alkemio Users', () => {
    it('Should get hub admins', async () => {
      jest
        .spyOn(alkemioClient, 'usersWithAuthorizationCredential')
        .mockResolvedValue(hubAdmins);

      const res = await alkemioAdapter.getHubAdmins(data.data.hub.id);
      expect(res.length === 0);
    });

    it('Should get opportunity admins', async () => {
      jest
        .spyOn(alkemioClient, 'usersWithAuthorizationCredential')
        .mockResolvedValue(opportunityAdmins);

      const res = await alkemioAdapter.getOpportunityAdmins(data.data.hub.id);
      expect(res.length === 1);
    });

    it('Should get challenge admins', async () => {
      jest
        .spyOn(alkemioClient, 'usersWithAuthorizationCredential')
        .mockResolvedValue(challengeAdmins);

      const res = await alkemioAdapter.getChallengeAdmins(data.data.hub.id);
      expect(res.length === 1);
    });

    it('Should throw an error', async () => {
      jest.spyOn(alkemioClient, 'user').mockResolvedValue(undefined);

      expect(alkemioAdapter.getApplicant(data.data)).rejects.toThrow();
    });
  });
});
