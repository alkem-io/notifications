import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import { AlkemioClientAdapterModule } from '@src/services';
import { AlkemioClientModule, NotifmeModule } from '@src/services/external';
import { ApplicationCreatedNotifier } from '@src/services/domain/application-created-notifier/application.created.notifier';
import { NotificationRecipientsAdapterModule } from './services/application/notification-recipients-adapter/notification.recipients.adapter.module';
import { UserRegistrationNotifier } from './services/domain/user-registration-notifier/user.registration.notifier';
import { CommunicationUpdateNotifier } from './services/domain/communication-update/communication.update.notifier';
import { CommunicationDiscussionCreatedNotifier } from './services/domain/communication-discussion-created/communication.discussion.created.notifier';

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
    ApplicationCreatedNotifier,
    UserRegistrationNotifier,
    CommunicationUpdateNotifier,
    CommunicationDiscussionCreatedNotifier,
  ],
  controllers: [AppController],
})
export class AppModule {}
