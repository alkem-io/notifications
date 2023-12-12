import { AlkemioClient, PlatformFeatureFlagName } from '@alkemio/client-lib';
import { Test } from '@nestjs/testing';
import { AlkemioClientAdapterProvider } from './alkemio.client.adapter.module';
import * as challengeAdminsData from '@test/data/challenge.admins.json';
import * as opportunityAdminsData from '@test/data/opportunity.admins.json';
import * as spaceAdminsData from '@test/data/space.admins.json';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import { AlkemioClientAdapter } from './alkemio.client.adapter';
import {
  MockAlkemioClientProvider,
  MockConfigServiceProvider,
  MockWinstonProvider,
} from '@test/mocks';
import {
  ALKEMIO_CLIENT_ADAPTER,
  ALKEMIO_CLIENT_PROVIDER,
} from '@src/common/enums';

const testData = {
  ...challengeAdminsData,
  ...opportunityAdminsData,
  ...spaceAdminsData,
  ...eventPayload,
};

describe('AlkemioAdapter', () => {
  let alkemioAdapter: AlkemioClientAdapter;
  let alkemioClient: AlkemioClient;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        MockWinstonProvider,
        MockAlkemioClientProvider,
        AlkemioClientAdapterProvider,
      ],
    }).compile();

    alkemioAdapter = moduleRef.get(ALKEMIO_CLIENT_ADAPTER);
    alkemioClient = moduleRef.get(ALKEMIO_CLIENT_PROVIDER);
  });

  describe('Alkemio Client Adapter', () => {
    it('Should throw an error', async () => {
      jest.spyOn(alkemioClient, 'user').mockResolvedValue(undefined);

      await expect(
        alkemioAdapter.getUser(testData.data.triggeredBy)
      ).rejects.toThrow();
    });

    it('Should return true', async () => {
      jest.spyOn(alkemioClient, 'featureFlags').mockResolvedValue([
        {
          name: PlatformFeatureFlagName.Ssi,
          enabled: false,
        },
        {
          name: PlatformFeatureFlagName.Communications,
          enabled: true,
        },
        {
          name: PlatformFeatureFlagName.Subscriptions,
          enabled: false,
        },
        {
          name: PlatformFeatureFlagName.Notifications,
          enabled: true,
        },
      ]);

      expect(await alkemioAdapter.areNotificationsEnabled()).toBe(true);
    });

    it('Should return false', async () => {
      jest.spyOn(alkemioClient, 'featureFlags').mockResolvedValue([
        {
          name: PlatformFeatureFlagName.Ssi,
          enabled: false,
        },
        {
          name: PlatformFeatureFlagName.Communications,
          enabled: true,
        },
        {
          name: PlatformFeatureFlagName.Subscriptions,
          enabled: false,
        },
        {
          name: PlatformFeatureFlagName.Notifications,
          enabled: false,
        },
      ]);

      expect(await alkemioAdapter.areNotificationsEnabled()).toBe(false);
    });
  });
});
