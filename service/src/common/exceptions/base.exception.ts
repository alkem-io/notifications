import { LogContext, AlkemioErrorStatus } from '@common/enums';

export class BaseException extends Error {
  public readonly context: LogContext;
  public readonly code: string;
  constructor(error: string, context: LogContext, code: AlkemioErrorStatus) {
    super(error);
    this.context = context;
    this.code = code.toLocaleString();
  }

  getContext(): LogContext {
    return this.context;
  }
}
