import { AuthorizationCredential } from '@alkemio/client-lib';

export const ROLE_PLATFORM_USER = 'PLATFORM_USER';

export type CredentialCriterion = {
  type: AuthorizationCredential;
  resourceID?: string;
};
