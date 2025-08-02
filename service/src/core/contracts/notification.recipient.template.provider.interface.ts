import { AuthorizationCredential } from '@alkemio/client-lib';
import { CredentialCriterion } from '../models/credential.criterion';

export interface INotificationRecipientTemplateProvider {
  getTemplate(): TemplateConfig;

  getNotificationEventRecipients(
    roleName: string,

    lookupMap?: Map<string, string>,
    templateRuleSets?: TemplateRuleSet[]
  ): CredentialCriterion[];
}
