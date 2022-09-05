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
  CommunicationUpdateCreatedNotificationBuilder,
  CommunityContextReviewSubmittedNotificationBuilder,
  UserRegisteredNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CommunityCollaborationInterestNotificationBuilder,
  AspectCreatedNotificationBuilder,
  AspectCommentCreatedNotificationBuilder,
  CalloutPublishedNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import {
  AlkemioUrlGeneratorModule,
  NotificationBuilder,
} from './services/application';

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
    NotificationBuilder,
    ApplicationCreatedNotificationBuilder,
    UserRegisteredNotificationBuilder,
    CommunicationUpdateCreatedNotificationBuilder,
    CommunicationDiscussionCreatedNotificationBuilder,
    CommunityContextReviewSubmittedNotificationBuilder,
    CommunityNewMemberNotificationBuilder,
    CommunityCollaborationInterestNotificationBuilder,
    AspectCreatedNotificationBuilder,
    AspectCommentCreatedNotificationBuilder,
    CalloutPublishedNotificationBuilder,
    NotificationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
