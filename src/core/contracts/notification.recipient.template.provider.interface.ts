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
  aspect_created?: TemplateRuleSet[];
  aspect_comment_created?: TemplateRuleSet[];
  user_registered?: TemplateRuleSet[];
  communication_update_sent?: TemplateRuleSet[];
  communication_discussion_created?: TemplateRuleSet[];
  community_review_submitted?: TemplateRuleSet[];
  community_new_member?: TemplateRuleSet[];
  community_collaboration_interest?: TemplateRuleSet[];
};

export interface INotificationRecipientTemplateProvider {
  getTemplate(): TemplateConfig;

  getCredentialCriteria(
    roleName: string,
    lookupMap?: Map<string, string>,
    templateRuleSets?: TemplateRuleSet[]
  ): CredentialCriterion[];
}
