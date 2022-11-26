import { AlkemioClient } from '@alkemio/client-lib';
import { Test } from '@nestjs/testing';
import { ALKEMIO_CLIENT_ADAPTER, ALKEMIO_CLIENT_PROVIDER } from '@common';
import { AlkemioClientAdapterProvider } from './alkemio.client.adapter.module';
import * as challengeAdminsData from '@test/data/challenge.admins.json';
import * as opportunityAdminsData from '@test/data/opportunity.admins.json';
import * as hubAdminsData from '@test/data/hub.admins.json';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import { AlkemioClientAdapter } from './alkemio.client.adapter';
import {
  MockAlkemioClientProvider,
  MockConfigServiceProvider,
  MockWinstonProvider,
} from 'service/test/mocks';

const testData = {
  ...challengeAdminsData,
  ...opportunityAdminsData,
  ...hubAdminsData,
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
        alkemioAdapter.getUser(testData.data.hub.id)
      ).rejects.toThrow();
    });

    it('Should return true', async () => {
      jest.spyOn(alkemioClient, 'featureFlags').mockResolvedValue([
        {
          name: 'ssi',
          enabled: false,
        },
        {
          name: 'communications',
          enabled: true,
        },
        {
          name: 'subscriptions',
          enabled: false,
        },
        {
          name: 'notifications',
          enabled: true,
        },
      ]);

      expect(await alkemioAdapter.areNotificationsEnabled()).toBe(true);
    });

    it('Should return false', async () => {
      jest.spyOn(alkemioClient, 'featureFlags').mockResolvedValue([
        {
          name: 'ssi',
          enabled: false,
        },
        {
          name: 'communications',
          enabled: true,
        },
        {
          name: 'subscriptions',
          enabled: false,
        },
        {
          name: 'notifications',
          enabled: false,
        },
      ]);

      expect(await alkemioAdapter.areNotificationsEnabled()).toBe(false);
    });
  });
});
