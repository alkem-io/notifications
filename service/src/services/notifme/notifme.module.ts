import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationTemplateBuilder } from './notification.templates.builder';
import { notifmeSdkFactory } from './notifme.sdk.factory';
import { NOTIFICATIONS_PROVIDER } from '@src/common/enums/providers';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NOTIFICATIONS_PROVIDER,
      useFactory: notifmeSdkFactory,
      inject: [WINSTON_MODULE_NEST_PROVIDER, ConfigService],
    },
    NotificationTemplateBuilder,
  ],
  exports: [NotificationTemplateBuilder, NOTIFICATIONS_PROVIDER],
})
export class NotifmeModule {}
