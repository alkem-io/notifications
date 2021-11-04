import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import {
  ApplicationNotificationBuilder,
  NotificationService,
  TemlateToCredentialMapper,
  AlkemioClientAdapterModule,
} from '@src/services';
import { AlkemioClientModule, NotifmeModule } from '@src/wrappers';
import { NotificationRecipientsAdapterModule } from './services/notification-recipients-adapter/notification.recipients.adapter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configuration],
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    NotifmeModule,
    AlkemioClientModule,
    AlkemioClientAdapterModule,
    NotificationRecipientsAdapterModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    NotificationService,
    ApplicationNotificationBuilder,
    TemlateToCredentialMapper,
  ],
  controllers: [AppController],
})
export class AppModule {}
