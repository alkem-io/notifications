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
  community_application_created?: TemplateRuleSet[];
  community_new_member?: TemplateRuleSet[];
  communication_update_sent?: TemplateRuleSet[];
  communication_discussion_created?: TemplateRuleSet[];
  collaboration_canvas_created?: TemplateRuleSet[];
  collaboration_card_created?: TemplateRuleSet[];
  collaboration_card_comment?: TemplateRuleSet[];
  collaboration_discussion_comment?: TemplateRuleSet[];
  collaboration_review_submitted?: TemplateRuleSet[];
  collaboration_interest?: TemplateRuleSet[];
  collaboration_callout_published?: TemplateRuleSet[];
  platform_user_registered?: TemplateRuleSet[];
  platform_user_removed?: TemplateRuleSet[];
};

export interface INotificationRecipientTemplateProvider {
  getTemplate(): TemplateConfig;

  getCredentialCriteria(
    roleName: string,
    lookupMap?: Map<string, string>,
    templateRuleSets?: TemplateRuleSet[]
  ): CredentialCriterion[];
}
