import { LogContext, AlkemioErrorStatus } from '@common/enums';
import { BaseException } from '../base.exception';

export class RolesNotProvidedException extends BaseException {
  constructor(error: string, context = LogContext.NOTIFICATIONS) {
    super(error, context, AlkemioErrorStatus.ROLES_NOT_PROVIDED);
  }
}
