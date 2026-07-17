/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import { LoggerService } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LogContext } from '@common/enums';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Environment, renderString } from 'nunjucks';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload';

const TEMPLATES_FOLDER = './src/email-templates';
const TEMPLATE_LANG = 'en-US';

// notifme-template renders every string field (to, title, subject, html) through
// one renderer. The default nunjucks renderer autoescapes, which is required for
// the HTML body (injection safety) but wrong for the plain-text fields: a mail
// client shows the subject/title literally, so "A & B" leaks as "A &amp; B".
// We keep autoescaping for html and re-render only the plain-text fields from the
// raw template through this non-escaping environment.
const plainTextEnv = new Environment(undefined, { autoescape: false });

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
      const render = getRenderer(renderString, TEMPLATES_FOLDER);
      const result: NotificationTemplateType = await render(
        template,
        templatePayload,
        TEMPLATE_LANG
      );
      this.renderPlainTextFields(template, templatePayload, result);
      return result;
    } catch (error: any) {
      this.logger.error(
        `Could not render template '${template}': ${error}`,
        LogContext.NOTIFICATIONS
      );
    }

    return undefined;
  }

  // Overwrite the plain-text fields (title, email subject) with a non-autoescaped
  // render of the raw template, so HTML entities in display names are not leaked.
  private renderPlainTextFields(
    template: string,
    templatePayload: BaseEmailPayload,
    result: NotificationTemplateType | undefined
  ): void {
    if (!result) {
      return;
    }
    const getRawTemplate = require(path.resolve(TEMPLATES_FOLDER, template));
    const rawTemplate = getRawTemplate(TEMPLATE_LANG);

    if (rawTemplate?.title != null) {
      result.title = plainTextEnv.renderString(
        rawTemplate.title,
        templatePayload
      );
    }
    const rawSubject = rawTemplate?.channels?.email?.subject;
    if (rawSubject != null && result.channels?.email) {
      result.channels.email.subject = plainTextEnv.renderString(
        rawSubject,
        templatePayload
      );
    }
  }
}
