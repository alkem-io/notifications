import {
  CompressedInAppNotificationPayload,
  InAppNotificationCategory,
  InAppNotificationPayloadBase,
} from '@alkemio/notifications-lib';

export type PayloadBuilderFn<
  TEvent,
  TPayload extends InAppNotificationPayloadBase
> = (
  category: InAppNotificationCategory,
  receiverIDs: string[],
  event: TEvent
) => CompressedInAppNotificationPayload<TPayload>;
