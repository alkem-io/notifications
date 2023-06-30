import { AuthorizationCredential } from '@alkemio/client-lib';

export const ROLE_EXTERNAL_USER = 'EXTERNAL_USER';

export type CredentialCriterion = {
  type: AuthorizationCredential;
  resourceID?: string;
};
