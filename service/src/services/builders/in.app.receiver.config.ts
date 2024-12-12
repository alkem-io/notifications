import { InAppNotificationCategory } from '@alkemio/notifications-lib';
import { AuthorizationCredential } from '@alkemio/client-lib/dist/generated/graphql';
import { UserPreferenceType } from '@alkemio/client-lib';

export type InAppReceiverConfig = {
  category: InAppNotificationCategory;
  credential: {
    type: AuthorizationCredential;
    resourceID?: string;
  };
  preferenceType?: UserPreferenceType;
};
