import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@src/common';
import NotifmeSdk from 'notifme-sdk';

export async function notifmeSdkFactory(
  logger: LoggerService,
  configService: ConfigService
): Promise<NotifmeSdk | undefined> {
  try {
    const notifmeSdk = new NotifmeSdk({
      channels: {
        email: {
          multiProviderStrategy: configService.get(
            ConfigurationTypes.NOTIFICATION_PROVIDERS
          )?.email?.multi_provider_strategy,
          providers: [
            {
              type: 'smtp',
              host: configService.get(ConfigurationTypes.NOTIFICATION_PROVIDERS)
                ?.email?.smtp?.host,
              port: configService.get(ConfigurationTypes.NOTIFICATION_PROVIDERS)
                ?.email?.smtp?.port,
              secure: configService.get(
                ConfigurationTypes.NOTIFICATION_PROVIDERS
              )?.email?.smtp?.secure,
              auth: {
                user: configService.get(
                  ConfigurationTypes.NOTIFICATION_PROVIDERS
                )?.email?.smtp?.auth?.user,
                pass: configService.get(
                  ConfigurationTypes.NOTIFICATION_PROVIDERS
                )?.email?.smtp?.auth?.pass,
              },
              tls: {
                rejectUnauthorized: configService.get(
                  ConfigurationTypes.NOTIFICATION_PROVIDERS
                )?.email?.smtp?.tls?.rejectUnauthorized,
              },
            },
            {
              type: 'logger',
            },
          ],
        },
      },
    });
    return notifmeSdk;
  } catch (error) {
    logger.error(
      `Could not create notifme SDK instance: ${error}`,
      LogContext.NOTIFICATIONS
    );
    return undefined;
  }
}
