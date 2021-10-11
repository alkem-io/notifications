/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { ConfigService } from '@nestjs/config';
import { LogContext, NOTIFICATIONS } from '@src/common';
import { renderString } from 'nunjucks';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService,
    @Inject(NOTIFICATIONS)
    private readonly notifmeService: NotifmeSdk
  ) {}

  async sendNotification(payload: any): Promise<NotificationStatus> {
    const getRenderer = require('notifme-template');
    const render = getRenderer(renderString, './src/templates');

    const notification = await render('welcome', payload, 'en-US');
    const notificationStatus = await this.notifmeService.send(
      notification.channels
    );
    this.logger.verbose?.(
      `Notification status: ${notificationStatus.status}`,
      LogContext.NOTIFICATIONS
    );

    return notificationStatus;
  }
}
