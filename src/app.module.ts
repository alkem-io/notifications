import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import {
  AlkemioClientAdapterModule,
  ApplicationCreatedNotificationBuilder,
} from '@src/services';
import { AlkemioClientModule, NotifmeModule } from '@src/services/external';
import { NotificationRecipientsAdapterModule } from './services/application/notification-recipients-adapter/notification.recipients.adapter.module';
import { UserRegisteredNotificationBuilder } from './services/domain/builders/user-registered/user.registered.notification.builder';
import { CommunicationUpdateNotificationBuilder } from './services/domain/builders/communication-updated/communication.updated.notification.builder';
import { CommunicationDiscussionCreatedNotificationBuilder } from './services/domain/builders/communication-discussion-created/communication.discussion.created.notification.builder';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator';
import { NotificationService } from './services/domain/notification/notification.service';

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
    AlkemioUrlGeneratorModule,
    NotificationRecipientsAdapterModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    ApplicationCreatedNotificationBuilder,
    UserRegisteredNotificationBuilder,
    CommunicationUpdateNotificationBuilder,
    CommunicationDiscussionCreatedNotificationBuilder,
    NotificationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
