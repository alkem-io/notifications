import { AlkemioClient, PlatformFeatureFlagName } from '@alkemio/client-lib';
import { Test } from '@nestjs/testing';
import { AlkemioClientAdapterProvider } from './alkemio.client.adapter.module';
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
