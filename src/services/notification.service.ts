import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk from 'notifme-sdk';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private configService: ConfigService
  ) {}

  async sendNotification(payload: any): Promise<any> {
    this.logger.log('MASTER OF DISASTER');
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
    const notificationRequest = {
      email: {
        from: 'info@alkem.io',
        to: 'valentin@alkem.io',
        subject: 'Test',
        html: `<b>${payload}</b>`,
      },
    };
    notifmeSdk.send(notificationRequest).then(console.log);
    // return {};
  }
}
