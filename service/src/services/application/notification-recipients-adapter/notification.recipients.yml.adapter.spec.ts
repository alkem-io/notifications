import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotificationRecipientsYmlAdapter } from '@src/services';
import { INotificationRecipientTemplateProvider } from '@core/contracts';
import {
  MockConfigServiceProvider,
  MockWinstonProvider,
} from 'service/test/mocks';

describe('NotificationRecipientsYmlAdapter', () => {
  let configService: ConfigService;
  let recipientTemplateProvider: INotificationRecipientTemplateProvider;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        NotificationRecipientsYmlAdapter,
        MockWinstonProvider,
      ],
    }).compile();

    recipientTemplateProvider =
      moduleRef.get<INotificationRecipientTemplateProvider>(
        NotificationRecipientsYmlAdapter
      );
    configService = moduleRef.get<ConfigService>(ConfigService);
  });

  describe('getTemplate', () => {
    it('configService is called', () => {
      // setup
      const spy = jest.spyOn(configService, 'get');
      spy.mockImplementationOnce(() => jest.fn());
      // act
      recipientTemplateProvider.getTemplate();
      // assert
      expect(jest.spyOn(configService, 'get')).toHaveBeenCalled();
    });
  });
});
