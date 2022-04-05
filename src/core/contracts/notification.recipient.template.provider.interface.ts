import { AuthorizationCredential } from '@alkemio/client-lib';
import { CredentialCriterion } from '../models/credential.criterion';

export type TemplateRule = {
  rule: {
    type: AuthorizationCredential;
    resource_id: string | undefined;
  };
};

export type TemplateRuleSet = {
  name: string;
  rules: TemplateRule[];
};

export type TemplateConfig = {
  application_created?: TemplateRuleSet[];
  user_registered?: TemplateRuleSet[];
  communication_update_sent?: TemplateRuleSet[];
  communication_discussion_created?: TemplateRuleSet[];
  community_review_submitted?: TemplateRuleSet[];
};

export interface INotificationRecipientTemplateProvider {
  getTemplate(): TemplateConfig;

  // todo
  /***
   * @deprecated use getCredentialCriteria2
   */
  getCredentialCriteria(
    lookupMap: Map<string, string>,
    templateRuleSets: TemplateRuleSet[] | undefined,
    roleName: string
  ): CredentialCriterion[];

  getCredentialCriteria2(
    roleName: string,
    lookupMap?: Map<string, string>,
    templateRuleSets?: TemplateRuleSet[]
  ): CredentialCriterion[];
}
