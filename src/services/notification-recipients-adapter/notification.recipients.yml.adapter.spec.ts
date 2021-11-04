import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { NotificationRecipientsYmlTemplate } from '@src/services';
import { INotificationRecipientTemplateProvider } from '@core/contracts';
import { MockConfigServiceProvider } from '@test/mocks';

describe('NotificationRecipientsYmlTemplate', () => {
  let configService: ConfigService;
  let recipientTemplateProvider: INotificationRecipientTemplateProvider;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [MockConfigServiceProvider, NotificationRecipientsYmlTemplate],
    }).compile();

    recipientTemplateProvider =
      moduleRef.get<INotificationRecipientTemplateProvider>(
        NotificationRecipientsYmlTemplate
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
