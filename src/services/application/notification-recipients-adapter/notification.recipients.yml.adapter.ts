import { Inject, Injectable, LoggerService } from '@nestjs/common';
import {
  INotificationRecipientTemplateProvider,
  TemplateConfig,
  TemplateRuleSet,
} from '@core/contracts';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common';
import { CredentialCriterion } from '@core/models/credential.criterion';
import { ruleToCredentialCriterion } from '../template-to-credential-mapper/utils/utils';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class NotificationRecipientsYmlAdapter
  implements INotificationRecipientTemplateProvider
{
  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService
  ) {}

  getTemplate(): TemplateConfig {
    // todo validate template?
    return (
      this.configService.get(ConfigurationTypes.NOTIFICATION_RECIPIENTS) ??
      ({} as TemplateConfig)
    );
  }

  public getCredentialCriteria(
    roleName: string,
    lookupMap?: Map<string, string>,
    templateRuleSets?: TemplateRuleSet[]
  ): CredentialCriterion[] {
    if (!templateRuleSets) {
      return [];
    }

    const ruleSetForRole = templateRuleSets.find(
      templateRuleSet => templateRuleSet.name === roleName
    );

    if (!ruleSetForRole) {
      this.logger.error(`Unable to identify rule set for role: ${roleName}`);
      return [];
    }

    const rules = ruleSetForRole.rules;

    return rules.map(x => ruleToCredentialCriterion(x, lookupMap));
  }
}
