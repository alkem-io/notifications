import { renderString } from 'nunjucks';

export class NotificationTemplateService {
  async renderTemplate(template: string, payload: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const getRenderer = require('notifme-template');
    const render = getRenderer(renderString, './src/templates');
    const notification = await render(template, payload, 'en-US');

    return notification;
  }
}
