import { AuthorizationCredential } from '@alkemio/client-lib';

export type CredentialCriteria = {
  type: AuthorizationCredential;
  resourceID?: string;
};
