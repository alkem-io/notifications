import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NOTIFICATIONS_PROVIDER, TEMPLATE_PROVIDER } from '@common/enums';
import { NotificationTemplateBuilder } from './notification.templates.builder';
import { notifmeSdkFactory } from './notifme.sdk.factory';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NOTIFICATIONS_PROVIDER,
      useFactory: notifmeSdkFactory,
      inject: [WINSTON_MODULE_NEST_PROVIDER, ConfigService],
    },
    {
      provide: TEMPLATE_PROVIDER,
      useClass: NotificationTemplateBuilder,
    },
  ],
  exports: [NOTIFICATIONS_PROVIDER, TEMPLATE_PROVIDER],
})
export class NotifmeModule {}
