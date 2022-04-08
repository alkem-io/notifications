import { LogContext, AlkemioErrorStatus } from '@common/enums';
import { BaseException } from '../base.exception';

export class TemplateNotProvidedException extends BaseException {
  constructor(error: string, context = LogContext.NOTIFICATIONS) {
    super(error, context, AlkemioErrorStatus.TEMPLATE_NOT_PROVIDED);
  }
}
