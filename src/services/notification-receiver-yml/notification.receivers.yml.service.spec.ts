import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import {
  INotificationRecipientProvider,
  INotificationRecipientTemplateProvider,
  RecipientCredential,
} from '@core/contracts';
import { WinstonConfigService } from '@src/config';
import { MockNotificationRecipientsYmlTemplateProvider } from '@test/mocks';
import { NotificationReceiversYml } from './';
import { NotificationRecipientsYmlTemplate } from '@src/services';
import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types';
import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';

describe('NotificationReceiversYml', () => {
  let notificationReceivers: INotificationRecipientProvider;
  let recipientTemplateProvider: INotificationRecipientTemplateProvider;

  beforeAll(async () => {
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
      ],
      providers: [
        MockNotificationRecipientsYmlTemplateProvider,
        NotificationReceiversYml,
      ],
    }).compile();

    notificationReceivers = moduleRef.get<NotificationReceiversYml>(
      NotificationReceiversYml
    );
    recipientTemplateProvider =
      moduleRef.get<INotificationRecipientTemplateProvider>(
        NotificationRecipientsYmlTemplate
      );
  });

  describe('getApplicationCreatedRecipients', () => {
    it('returns empty array on missing template', () => {
      // setup
      const emptyTemplateMock = {};
      jest
        .spyOn(recipientTemplateProvider, 'getTemplate')
        .mockReturnValue(emptyTemplateMock);
      // act
      const result = notificationReceivers.getApplicationCreatedRecipients(
        {} as any
      );
      // assert
      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toHaveLength(0);
    });
    it('returns correct response', () => {
      const payload = {
        applicantID: 'applicant',
        hub: {
          id: 'hub',
        },
      } as ApplicationCreatedEventPayload;

      const expectedResponse: RecipientCredential[] = [
        {
          role: AuthorizationCredential.GlobalAdmin,
          resourceID: undefined,
          isAdmin: true,
        },
        {
          role: AuthorizationCredential.EcoverseAdmin,
          resourceID: 'hub',
          isAdmin: true,
        },
        {
          role: AuthorizationCredential.UserSelfManagement,
          resourceID: 'applicant',
          isAdmin: false,
        },
      ];

      jest
        .spyOn(recipientTemplateProvider, 'getTemplate')
        .mockReturnValue(templateMock);

      // act
      const res =
        notificationReceivers.getApplicationCreatedRecipients(payload);
      // assert
      expect(res).toStrictEqual(expectedResponse);
    });
  });
});

const templateMock = {
  application_created: {
    admin: [
      {
        rule: {
          type: AuthorizationCredential.GlobalAdmin,
          resource_id: '<>',
        },
      },
      {
        rule: {
          type: AuthorizationCredential.EcoverseAdmin,
          resource_id: '<>',
        },
      },
    ],
    applicant: [
      {
        rule: {
          type: AuthorizationCredential.UserSelfManagement,
          resource_id: '<>',
        },
      },
    ],
  },
};
