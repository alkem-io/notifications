import { AuthorizationCredential } from '@alkemio/client-lib';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import {
  INotificationRecipientProvider,
  INotificationRecipientTemplateProvider,
  RecipientCredential,
} from '@core/contracts';
import { WinstonConfigService } from '@src/config';
import { ApplicationCreatedEventPayload } from '@src/types';
import configuration from '@config/configuration';
import { MockNotificationRecipientsYmlProvider } from '@test/mocks';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@src/common';
import { TemplateToCredentialMapper } from './';
import { MockNotificationRecipientsAdapterModule } from '@test/mocks/notification.recipiens.adapter.module.mock';

describe('TemplateToCredentialMapper', () => {
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
        MockNotificationRecipientsAdapterModule,
      ],
      providers: [
        MockNotificationRecipientsYmlProvider,
        TemplateToCredentialMapper,
      ],
    }).compile();

    notificationReceivers = moduleRef.get<TemplateToCredentialMapper>(
      TemplateToCredentialMapper
    );
    recipientTemplateProvider =
      moduleRef.get<INotificationRecipientTemplateProvider>(
        NOTIFICATION_RECIPIENTS_YML_ADAPTER
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
          role: AuthorizationCredential.EcoverseAdmin,
          resourceID: 'hub',
          isAdmin: true,
        },
        {
          role: AuthorizationCredential.GlobalAdmin,
          resourceID: undefined,
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
      expect(res).toEqual(expect.arrayContaining(expectedResponse));
    });
  });
});

const templateMock = {
  application_created: {
    admin: [
      {
        rule: {
          type: AuthorizationCredential.EcoverseAdmin,
          resource_id: '<>',
        },
      },
      {
        rule: {
          type: AuthorizationCredential.GlobalAdmin,
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
