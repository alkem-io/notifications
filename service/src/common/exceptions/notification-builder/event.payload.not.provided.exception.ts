import { LogContext, AlkemioErrorStatus } from '@common/enums';
import { BaseException } from '../base.exception';

export class EventPayloadNotProvidedException extends BaseException {
  constructor(error: string, context = LogContext.NOTIFICATIONS) {
    super(error, context, AlkemioErrorStatus.PAYLOAD_NOT_PROVIDED);
  }
}
