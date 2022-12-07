import { LogContext, AlkemioErrorStatus } from '@common/enums';
import { BaseException } from '../base.exception';

export class RuleSetNotFoundException extends BaseException {
  constructor(error: string, context = LogContext.NOTIFICATIONS) {
    super(error, context, AlkemioErrorStatus.RULES_SET_NOT_FOUND);
  }
}
