import { Test, TestingModule } from '@nestjs/testing';
import {
  MockAlkemioClientAdapterProvider,
  MockNotificationRecipientsYmlProvider,
  MockNotificationTemplateBuilderProvider,
  MockWinstonProvider,
} from '@test/mocks';
import { asyncToThrow } from '@test/utils';
import {
  ALKEMIO_CLIENT_ADAPTER,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  RolesNotProvidedException,
  TemplateNotProvidedException,
} from '@src/common';
import { NotificationBuilder } from './notification.builder';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import {
  INotificationRecipientTemplateProvider,
  INotifiedUsersProvider,
} from '@core/contracts';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('NotificationBuilder', () => {
  let loggerService: LoggerService;
  let alkemioAdapter: INotifiedUsersProvider;
  let recipientTemplateProvider: INotificationRecipientTemplateProvider;
  let notificationBuilder: NotificationBuilder;
  let moduleRef: TestingModule;
  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        NotificationBuilder,
        MockWinstonProvider,
        MockAlkemioClientAdapterProvider,
        MockNotificationTemplateBuilderProvider,
        MockNotificationRecipientsYmlProvider,
      ],
    }).compile();

    loggerService = moduleRef.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
    alkemioAdapter = moduleRef.get<INotifiedUsersProvider>(
      ALKEMIO_CLIENT_ADAPTER
    );
    recipientTemplateProvider =
      moduleRef.get<INotificationRecipientTemplateProvider>(
        NOTIFICATION_RECIPIENTS_YML_ADAPTER
      );
  });

  beforeEach(async () => {
    notificationBuilder = (
      await moduleRef.resolve(NotificationBuilder)
    ).reset(); // avoid preserving state across the tests
  });

  describe('throw on missing values', () => {
    it('roleConfig', async () => {
      await asyncToThrow(
        notificationBuilder.build(),
        RolesNotProvidedException
      );
    });
    it.skip('throw on rule set not found', async () => {
      const builder = notificationBuilder
        .setRoleConfig(roleConfig)
        .setTemplateType('user_registered');
      // todo more setup
      await asyncToThrow(builder.build(), TemplateNotProvidedException);
    });
  });
  it('returns empty templates array on no templateType', async () => {
    const builder = notificationBuilder.setRoleConfig(roleConfig);
    const spy = jest.spyOn(loggerService, 'warn').mockImplementation();

    expect(await builder.build()).toEqual([]);
    expect(spy).toBeCalled();
  });
  it('returns empty templates array on no recipients found', async () => {
    const builder = notificationBuilder
      .setRoleConfig(roleConfig)
      .setTemplateType('user_registered');

    jest
      .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
      .mockResolvedValue([]);

    expect(await builder.build()).toEqual([]);
  });
  it('returns all recipients if no preference is specified', async () => {
    const builder = notificationBuilder
      .setRoleConfig(roleConfig)
      .setTemplateType('user_registered');

    jest
      .spyOn(alkemioAdapter, 'getUniqueUsersMatchingCredentialCriteria')
      .mockResolvedValue([{ id: '1' }, { id: 2 }] as any);

    jest
      .spyOn(recipientTemplateProvider, 'getTemplate')
      .mockReturnValue({ user_registered: [] });

    expect(await builder.build()).toEqual([]);
  });

  describe('setters', () => {
    test.concurrent.each([
      ['setPayload', {}, 'payload'],
      ['setEventUser', 'mockid', 'eventUserId'],
      ['setRoleConfig', [{}], 'roleConfig'],
      ['setTemplateVariables', new Map(), 'templateVariables'],
      ['setTemplateType', 'user_registered', 'templateType'],
      ['setTemplateBuilderFn', () => '', 'templatePayloadBuilderFn'],
    ])('%s', (method, value: any, field) => {
      expect(
        notificationBuilder[method as keyof NotificationBuilder](value)
      ).toEqual(notificationBuilder);
      const options = notificationBuilder.getOptions();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(options[field]).toEqual(value);
    });
    it('getOptions', () => {
      const builder = notificationBuilder
        .setTemplateType('user_registered')
        .setPayload({})
        .setRoleConfig({} as any);
      expect(builder.getOptions()).toEqual({
        payload: {},
        templateType: 'user_registered',
        roleConfig: [{}],
      });
    });
    it('reset', () => {
      const builder = notificationBuilder
        .setTemplateType('user_registered')
        .setPayload({})
        .setRoleConfig({} as any);
      builder.reset();
      expect(builder.getOptions()).toEqual({});
    });
  });
});

const roleConfig = [
  {
    role: 'mock',
    preferenceType: UserPreferenceType.NotificationUserSignUp,
    emailTemplate: EmailTemplate.USER_REGISTRATION_ADMIN,
  },
];
