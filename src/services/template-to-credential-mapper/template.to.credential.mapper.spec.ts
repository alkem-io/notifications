import { Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import {
  INotificationRecipientTemplateProvider,
  INotificationRecipientTemplateProvider,
  RecipientCredential,
} from '@core/contracts';
import { WinstonConfigService } from '@src/config';
import { MockNotificationRecipientsYmlTemplateProvider } from '@test/mocks';
import { TemplateToCredentialMapper } from './';
import { NotificationRecipientsYmlAdapter } from '@src/services';
import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types';
import { ConfigModule } from '@nestjs/config';
import configuration from '@config/configuration';

describe('TemplateToCredentialMapper', () => {
  let notificationReceivers: INotificationRecipientTemplateProvider;
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
        TemplateToCredentialMapper,
      ],
    }).compile();

    notificationReceivers = moduleRef.get<TemplateToCredentialMapper>(
      TemplateToCredentialMapper
    );
    recipientTemplateProvider =
      moduleRef.get<INotificationRecipientTemplateProvider>(
        NotificationRecipientsYmlAdapter
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
