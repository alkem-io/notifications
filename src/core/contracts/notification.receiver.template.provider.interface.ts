import { AuthorizationCredential } from '@alkemio/client-lib';

export type TemplateRule = {
  rule: {
    type: AuthorizationCredential;
    resource_id: string;
  };
};

export type TemplateRow = {
  admin: TemplateRule[];
  applicant: TemplateRule[];
};

export type TemplateConfig = {
  application_created: TemplateRow;
};

export interface INotificationRecipientTemplateProvider {
  getTemplate(): TemplateConfig;
}
