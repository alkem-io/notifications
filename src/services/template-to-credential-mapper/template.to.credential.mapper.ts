import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  INotificationRecipientProvider,
  INotificationRecipientTemplateProvider,
  RecipientCredential,
} from '@core/contracts';
import { NOTIFICATION_RECIPIENTS_YML_ADAPTER } from '@src/common';
import { ruleToCredential } from './utils/utils';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';

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
    payload: ApplicationCreatedEventPayload,
    roleName: string
  ): RecipientCredential[] {
    const applicationCreatedTemplate =
      this.recipientTemplateProvider.getTemplate().application_created;

    if (!applicationCreatedTemplate) {
      return [];
    }

    const ruleSetForRole = applicationCreatedTemplate.find(
      templateRuleSet => templateRuleSet.name === roleName
    );

    if (!ruleSetForRole) {
      this.logger.error(`Unable to identify rule set for role: ${roleName}`);
      return [];
    }

    const rules = ruleSetForRole.rules;

    return rules.map(x => ruleToCredential(x, payload));
  }
}
