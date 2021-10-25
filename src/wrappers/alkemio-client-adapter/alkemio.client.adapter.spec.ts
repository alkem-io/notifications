import { AlkemioClient } from '@alkemio/client-lib';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { ALKEMIO_CLIENT_ADAPTER, ALKEMIO_CLIENT_PROVIDER } from '@src/common';
import { WinstonConfigService } from '@src/config';
import configuration from '@src/config/configuration';
import { INotifiedUsersProvider } from '@src/types';
import { WinstonModule } from 'nest-winston';
import { AlkemioClientAdapterModule } from './alkemio.client.adapter.module';
import * as challengeAdminsData from '@test/data/challenge.admins.json';
import * as opportunityAdminsData from '@test/data/opportunity.admins.json';
import * as hubAdminsData from '@test/data/hub.admins.json';
import * as eventPayload from '@test/data/event.payload.json';

const testData = {
  ...challengeAdminsData,
  ...opportunityAdminsData,
  ...hubAdminsData,
  ...eventPayload,
};

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
        .mockResolvedValue(testData.hubAdmins);

      const res = await alkemioAdapter.getHubAdmins(
        testData.eventPayload.data.hub.id
      );
      expect(res.length === 0);
    });

    it('Should get opportunity admins', async () => {
      jest
        .spyOn(alkemioClient, 'usersWithAuthorizationCredential')
        .mockResolvedValue(testData.opportunityAdmins);

      const res = await alkemioAdapter.getOpportunityAdmins(
        testData.eventPayload.data.hub.id
      );
      expect(res.length === 1);
    });

    it('Should get challenge admins', async () => {
      jest
        .spyOn(alkemioClient, 'usersWithAuthorizationCredential')
        .mockResolvedValue(testData.challengeAdmins);

      const res = await alkemioAdapter.getChallengeAdmins(
        testData.eventPayload.data.hub.id
      );
      expect(res.length === 1);
    });

    it('Should throw an error', async () => {
      jest.spyOn(alkemioClient, 'user').mockResolvedValue(undefined);

      expect(
        alkemioAdapter.getApplicant(testData.eventPayload.data.hub.id)
      ).rejects.toThrow();
    });
  });
});
