import { LoggerService } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LogContext } from '@src/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { renderString } from 'nunjucks';
import { NotificationTemplateType } from '@src/types/notification.template.type';

@Injectable()
export class NotificationTemplateBuilder<
  TTemplatePayload = Record<string, unknown>
> {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService
  ) {}
  async buildTemplate(
    template: string,
    templatePayload: TTemplatePayload
  ): Promise<NotificationTemplateType | undefined> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const getRenderer = require('notifme-template');
      const render = getRenderer(renderString, './src/templates');
      return await render(template, templatePayload, 'en-US');
    } catch (error) {
      this.logger.error(
        `Could not render template '${template}': ${error}`,
        LogContext.NOTIFICATIONS
      );
    }

    return undefined;
  }
}
