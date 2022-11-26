import { Test } from '@nestjs/testing';
import {
  MockAlkemioClientAdapterProvider,
  MockNotificationRecipientsYmlProvider,
  MockNotificationTemplateBuilderProvider,
  MockWinstonProvider,
} from 'service/test/mocks';
import { asyncToThrow } from 'service/test/utils';
import {
  ALKEMIO_CLIENT_ADAPTER,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  RolesNotProvidedException,
} from '@common';
import {
  NotificationBuilder,
  NotificationOptions,
} from './notification.builder';
import {
  INotificationRecipientTemplateProvider,
  INotifiedUsersProvider,
} from '@core/contracts';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('NotificationBuilder', () => {
  let alkemioAdapter: INotifiedUsersProvider;
  let recipientTemplateProvider: INotificationRecipientTemplateProvider;
  let notificationBuilder: NotificationBuilder<any, any>;
  let logger: LoggerService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotificationBuilder,
        MockWinstonProvider,
        MockAlkemioClientAdapterProvider,
        MockNotificationTemplateBuilderProvider,
        MockNotificationRecipientsYmlProvider,
      ],
    }).compile();

    alkemioAdapter = moduleRef.get(ALKEMIO_CLIENT_ADAPTER);
    recipientTemplateProvider = moduleRef.get(
      NOTIFICATION_RECIPIENTS_YML_ADAPTER
    );
    notificationBuilder = moduleRef.get(NotificationBuilder);
    logger = moduleRef.get(WINSTON_MODULE_NEST_PROVIDER);
  });

  describe('throw on missing values', () => {
    it('roleConfig', async () => {
      const options = getBaseOptions();
      options.roleConfig = [];

      await asyncToThrow(
        notificationBuilder.build(options),
        RolesNotProvidedException
      );
    });
    it('throw on rule set not found', async () => {
      const loggerSpy = jest.spyOn(logger, 'warn');

      await notificationBuilder.build(getBaseOptions());

      expect(loggerSpy).toBeCalledWith(
        expect.stringContaining('No rule set(s) found for roles')
      );
    });
  });
  it('returns empty templates array on no recipients found', async () => {
    jest
      .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
      .mockResolvedValue([]);

    expect(await notificationBuilder.build(getBaseOptions())).toEqual([]);
  });
  it('returns all recipients if no preference is specified', async () => {
    jest
      .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
      .mockResolvedValue([{ id: '1' }, { id: 2 }] as any);

    jest
      .spyOn(recipientTemplateProvider, 'getTemplate')
      .mockReturnValue({ user_registered: [] });

    await expect(await notificationBuilder.build(getBaseOptions())).toEqual([]);
  });
});

const getBaseOptions = (): NotificationOptions<any, any> => ({
  payload: {},
  templateType: 'application_created',
  templatePayloadBuilderFn: () => ({}),
  roleConfig: [{}] as any,
});
