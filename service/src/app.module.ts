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
  CommunityApplicationCreatedNotificationBuilder,
  NotificationRecipientsAdapterModule,
} from '@src/services';
import { AlkemioClientModule, NotifmeModule } from '@src/services/external';
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
  CommunicationOrganizationMessageNotificationBuilder,
  CommunicationCommunityLeadsMessageNotificationBuilder,
  CommunicationUserMentionNotificationBuilder,
  CommunicationOrganizationMentionNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
} from './services/application';
import { CollaborationWhiteboardCreatedNotificationBuilder } from './services/domain/builders/collaboration-whiteboard-created/collaboration.whiteboard.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from './services/domain/builders/collaboration-discussion-comment/collaboration.discussion.comment.notification.builder';
import { CommunityInvitationCreatedNotificationBuilder } from './services/domain/builders/community-invitation-created/community.invitation.created.notification.builder';
import { CommentReplyNotificationBuilder } from './services/domain/builders/comment-reply/comment.reply.notification.builder';
import { CommunityExternalInvitationCreatedNotificationBuilder } from './services/domain/builders/community-external-invitation-created/community.external.invitation.created.notification.builder';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator/alkemio.url.generator.module';
import { PlatformGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform-global-role-change/platform.global.role.change.notification.builder';
import { VirtualContributorInvitationCreatedNotificationBuilder } from './services/domain/builders/virtual-contributor-invitation-created/virtual.contributor.invitation.created.notification.builder';
import { HealthController } from './health.controller';

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
    AlkemioUrlGenerator,
    CommunityApplicationCreatedNotificationBuilder,
    CommunityInvitationCreatedNotificationBuilder,
    CommunityExternalInvitationCreatedNotificationBuilder,
    PlatformGlobalRoleChangeNotificationBuilder,
    PlatformUserRegisteredNotificationBuilder,
    PlatformUserRemovedNotificationBuilder,
    PlatformForumDiscussionCommentNotificationBuilder,
    CommunicationUpdateCreatedNotificationBuilder,
    PlatformForumDiscussionCreatedNotificationBuilder,
    CommunicationUserMessageNotificationBuilder,
    CommunicationOrganizationMessageNotificationBuilder,
    CommunicationCommunityLeadsMessageNotificationBuilder,
    CommunicationUserMentionNotificationBuilder,
    CommunicationOrganizationMentionNotificationBuilder,
    CommunityNewMemberNotificationBuilder,
    CollaborationWhiteboardCreatedNotificationBuilder,
    CollaborationPostCreatedNotificationBuilder,
    CollaborationPostCommentNotificationBuilder,
    CollaborationDiscussionCommentNotificationBuilder,
    CollaborationCalloutPublishedNotificationBuilder,
    CommentReplyNotificationBuilder,
    NotificationService,
    VirtualContributorInvitationCreatedNotificationBuilder,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
