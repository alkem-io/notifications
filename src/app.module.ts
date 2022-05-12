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
  NotificationRecipientsAdapterModule,
} from '@src/services';
import { AlkemioClientModule, NotifmeModule } from '@src/services/external';
import {
  CommunicationDiscussionCreatedNotificationBuilder,
  CommunicationUpdateNotificationBuilder,
  CommunityContextReviewSubmittedNotificationBuilder,
  UserRegisteredNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
} from './services/domain/builders';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator';
import { NotificationService } from './services/domain/notification/notification.service';
import { NotificationBuilderFactoryProvider } from './services/application/notification-builder';
import { NotificationBuilder } from '@src/services/application/notification-builder/notification.builder1';

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
    NotificationBuilderFactoryProvider,
    NotificationBuilder,
    ApplicationCreatedNotificationBuilder,
    UserRegisteredNotificationBuilder,
    CommunicationUpdateNotificationBuilder,
    CommunicationDiscussionCreatedNotificationBuilder,
    CommunityContextReviewSubmittedNotificationBuilder,
    CommunityNewMemberNotificationBuilder,
    NotificationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
