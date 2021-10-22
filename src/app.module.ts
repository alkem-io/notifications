import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import { ApplicationNotificationBuilder } from './services/application.notification.builder';
import { NotificationService } from './services/notification.service';
import { AlkemioClientAdapterModule } from './wrappers/alkemio-client-adapter/alkemio.client.adapter.module';
import { AlkemioClientModule } from './wrappers/alkemio-client/alkemio.client.module';
import { NotifmeModule } from './wrappers/notifme/notifme.module';

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
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    NotificationService,
    ApplicationNotificationBuilder,
  ],
  controllers: [AppController],
})
export class AppModule {}
