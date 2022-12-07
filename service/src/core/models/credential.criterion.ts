import { AuthorizationCredential } from '@alkemio/client-lib';

export type CredentialCriterion = {
  type: AuthorizationCredential;
  resourceID?: string;
};
