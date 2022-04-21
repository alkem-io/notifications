import { LogContext, AlkemioErrorStatus } from '@common/enums';
import { BaseException } from './base.exception';

export class NotificationNoChannelsException extends BaseException {
  constructor(error: string, context = LogContext.NOTIFICATIONS) {
    super(error, context, AlkemioErrorStatus.NOTIFICATION_NO_CHANNELS);
  }
}
