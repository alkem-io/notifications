import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import { AlkemioClientAdapter, AlkemioClientAdapterModule } from '@src/services';
import { AlkemioClientModule, NotificationTemplateBuilder, NotifmeModule } from '@src/services/external';
import {
  PlatformForumDiscussionCreatedNotificationBuilder,
  CommunicationUpdateCreatedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CollaborationPostCreatedNotificationBuilder,
  CollaborationPostCommentNotificationBuilder,
  CollaborationCalloutPublishedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
  PlatformUserRemovedNotificationBuilder,
  CommunicationUserMessageNotificationBuilder,
  OrganizationMessageNotificationBuilder,
  CommunicationCommunityLeadsMessageNotificationBuilder,
  CommunicationUserMentionNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  CommunityApplicationCreatedNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import { CollaborationWhiteboardCreatedNotificationBuilder } from './services/domain/builders/space/collaboration.whiteboard.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from './services/domain/builders/space/collaboration.discussion.comment.notification.builder';
import { CommunityInvitationCreatedNotificationBuilder } from './services/domain/builders/space/community.invitation.created.notification.builder';
import { CommentReplyNotificationBuilder } from './services/domain/builders/space/comment.reply.notification.builder';
import { CommunityPlatformInvitationCreatedNotificationBuilder } from './services/domain/builders/space/community.platform.invitation.created.notification.builder';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator/alkemio.url.generator.module';
import { PlatformGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform/platform.global.role.change.notification.builder';
import { CommunityInvitationVirtualContributorCreatedNotificationBuilder } from './services/domain/builders/space/community.invitation.virtual.contributor.created.notification.builder';
import { HealthController } from './health.controller';
import { PlatformSpaceCreatedNotificationBuilder } from './services/domain/builders/platform/platform.space.created.notification.builder';

import { InAppDispatcher } from './services/dispatchers/in-app';
import { AlkemioUrlGenerator } from './services/application/alkemio-url-generator/alkemio.url.generator';
import { AlkemioClient } from '@alkemio/client-lib';

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
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    AlkemioClientAdapter,
    NotificationTemplateBuilder,
    AlkemioUrlGenerator,
    CommunityApplicationCreatedNotificationBuilder,
    CommunityInvitationCreatedNotificationBuilder,
    CommunityPlatformInvitationCreatedNotificationBuilder,
    PlatformGlobalRoleChangeNotificationBuilder,
    PlatformUserRegisteredNotificationBuilder,
    PlatformUserRemovedNotificationBuilder,
    PlatformForumDiscussionCommentNotificationBuilder,
    CommunicationUpdateCreatedNotificationBuilder,
    PlatformForumDiscussionCreatedNotificationBuilder,
    CommunicationUserMessageNotificationBuilder,
    OrganizationMessageNotificationBuilder,
    CommunicationCommunityLeadsMessageNotificationBuilder,
    CommunicationUserMentionNotificationBuilder,
    OrganizationMentionNotificationBuilder,
    CommunityNewMemberNotificationBuilder,
    CollaborationWhiteboardCreatedNotificationBuilder,
    CollaborationPostCreatedNotificationBuilder,
    CollaborationPostCommentNotificationBuilder,
    CollaborationDiscussionCommentNotificationBuilder,
    CollaborationCalloutPublishedNotificationBuilder,
    CommentReplyNotificationBuilder,
    NotificationService,
    CommunityInvitationVirtualContributorCreatedNotificationBuilder,
    PlatformSpaceCreatedNotificationBuilder,
    //
    InAppDispatcher,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
