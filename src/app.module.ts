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
import { NotificationRecipientsAdapterModule } from '@src/services';
import {
  UserRegisteredNotificationBuilder,
  CommunityContextReviewSubmittedNotificationBuilder,
  CommunicationUpdateNotificationBuilder,
  CommunicationDiscussionCreatedNotificationBuilder,
} from './services/domain/builders';
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
    CommunityContextReviewSubmittedNotificationBuilder,
    NotificationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
