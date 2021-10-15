import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, LoggerService, Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ConfigurationTypes,
  LogContext,
  NOTIFICATIONS_PROVIDER,
  TEMPLATE_PROVIDER,
} from '@common/enums';
import NotifmeSdk from 'notifme-sdk';
import { NotificationTemplateService } from './notifme.templates.service';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NOTIFICATIONS_PROVIDER,
      useFactory: async (
        logger: LoggerService,
        configService: ConfigService
      ) => {
        try {
          const notifmeSdk = new NotifmeSdk({
            channels: {
              email: {
                multiProviderStrategy: 'fallback',
                providers: [
                  {
                    type: 'smtp',
                    host: configService.get(
                      ConfigurationTypes.NOTIFICATION_PROVIDERS
                    )?.email?.smtp?.host,
                    port: configService.get(
                      ConfigurationTypes.NOTIFICATION_PROVIDERS
                    )?.email?.smtp?.port,
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
        }
      },
      inject: [WINSTON_MODULE_NEST_PROVIDER, ConfigService],
    },
    {
      provide: TEMPLATE_PROVIDER,
      useFactory: async (logger: LoggerService) => {
        try {
          return new NotificationTemplateService();
        } catch (error) {
          logger.error(
            `Could not get notifme-template renderer: ${error}`,
            LogContext.NOTIFICATIONS
          );
        }
      },
      inject: [WINSTON_MODULE_NEST_PROVIDER],
    },
  ],
  exports: [NOTIFICATIONS_PROVIDER, TEMPLATE_PROVIDER],
})
export class NotifmeModule {}
