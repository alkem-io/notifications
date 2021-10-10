/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk from 'notifme-sdk';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@src/common';
import { renderString } from 'nunjucks';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService
  ) {}

  async sendNotification(payload: any): Promise<any> {
    const notifmeSdk = new NotifmeSdk({
      channels: {
        email: {
          providers: [
            {
              type: 'smtp',
              host: this.configService.get(
                ConfigurationTypes.NOTIFICATION_PROVIDERS
              )?.email?.smtp?.host,
              port: this.configService.get(
                ConfigurationTypes.NOTIFICATION_PROVIDERS
              )?.email?.smtp?.port,
              secure: this.configService.get(
                ConfigurationTypes.NOTIFICATION_PROVIDERS
              )?.email?.smtp?.secure,
              auth: {
                user: this.configService.get(
                  ConfigurationTypes.NOTIFICATION_PROVIDERS
                )?.email?.smtp?.auth?.user,
                pass: this.configService.get(
                  ConfigurationTypes.NOTIFICATION_PROVIDERS
                )?.email?.smtp?.auth?.pass,
              },
              tls: {
                rejectUnauthorized: this.configService.get(
                  ConfigurationTypes.NOTIFICATION_PROVIDERS
                )?.email?.smtp?.tls?.rejectUnauthorized,
              },
            },
          ],
        },
      },
    });

    const getRenderer = require('notifme-template');
    const render = getRenderer(renderString, './src/templates');

    const notification = await render('welcome', payload, 'en-US');
    const notificationStatus = await notifmeSdk.send(notification.channels);
    this.logger.verbose?.('Notification status:', LogContext.NOTIFICATIONS);
    this.logger.verbose?.(notificationStatus, LogContext.NOTIFICATIONS);
    return notificationStatus;
  }
}
