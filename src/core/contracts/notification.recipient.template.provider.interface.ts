import { AuthorizationCredential } from '@alkemio/client-lib';

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
  user_registration?: TemplateRuleSet[];
  communication_update?: TemplateRuleSet[];
};

export interface INotificationRecipientTemplateProvider {
  getTemplate(): TemplateConfig;
}
