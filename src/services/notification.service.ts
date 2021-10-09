import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import NotifmeSdk from 'notifme-sdk';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
  ) {}

  async sendNotification(payload: any): Promise<any> {
    const notifmeSdk = new NotifmeSdk({
      channels: {
        email: {
          providers: [
            {
              type: 'smtp',
              host: 'host.docker.internal',
              port: 1025,
              secure: true,
              auth: {
                user: 'test',
                pass: 'test',
              },
              tls: {
                rejectUnauthorized: false,
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
