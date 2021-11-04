import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  INotificationRecipientProvider,
  INotificationRecipientTemplateProvider,
  RecipientCredential,
} from '@core/contracts';
import { ApplicationCreatedEventPayload } from '@src/types';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@src/common';
import { ruleToCredential } from './utils/utils';

// todo tests
@Injectable()
export class TemplateToCredentialMapper
  implements INotificationRecipientProvider
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  public getApplicationCreatedRecipients(
    payload: ApplicationCreatedEventPayload
  ): RecipientCredential[] {
    const template = this.recipientTemplateProvider.getTemplate();

    if (!template.application_created) {
      return [];
    }

    const { admin = [], applicant = [] } = template.application_created;

    const admins = admin.map(x => ruleToCredential(x, payload, true));
    const applicants = applicant.map(x => ruleToCredential(x, payload));

    // and filter out the mismatches
    return [...admins, ...applicants].filter(x => x) as RecipientCredential[];
  }
}
