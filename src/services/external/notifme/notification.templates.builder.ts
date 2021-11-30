import { LoggerService } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LogContext } from '@src/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { renderString } from 'nunjucks';

@Injectable()
export class NotificationTemplateBuilder {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService
  ) {}
  async buildTemplate(template: string, templatePayload: any): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const getRenderer = require('notifme-template');
      const render = getRenderer(renderString, './src/templates');
      const notification = await render(template, templatePayload, 'en-US');

      return notification;
    } catch (error) {
      this.logger.error(
        `Could not render template: ${error}`,
        LogContext.NOTIFICATIONS
      );
    }
  }
}
