/* eslint-disable @typescript-eslint/no-require-imports */
import { LoggerService } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LogContext } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { renderString } from 'nunjucks';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload';

@Injectable()
export class NotificationTemplateBuilder {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: LoggerService
  ) {}
  async buildTemplate(
    template: string,
    templatePayload: BaseEmailPayload
  ): Promise<NotificationTemplateType | undefined> {
    try {
      const getRenderer = require('notifme-template');
      const render = getRenderer(renderString, './src/email-templates');
      const result = await render(template, templatePayload, 'en-US');
      return result;
    } catch (error: any) {
      this.logger.error(
        `Could not render template '${template}': ${error}`,
        LogContext.NOTIFICATIONS
      );
    }

    return undefined;
  }
}
