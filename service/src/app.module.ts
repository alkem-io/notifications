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
import { CommunityPlatformInvitationCreatedNotificationBuilder } from './services/domain/builders/community-platform-invitation-created/community.platform.invitation.created.notification.builder';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator/alkemio.url.generator.module';
import { PlatformGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform-global-role-change/platform.global.role.change.notification.builder';
import { CommunityInvitationVirtualContributorCreatedNotificationBuilder } from './services/domain/builders/community-invitation-virtual-contributor-created/community.invitation.virtual.contributor.created.notification.builder';
import { HealthController } from './health.controller';
import { SpaceCreatedNotificationBuilder } from './services/domain/builders/space-created/space.created.notification.builder';

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
    CommunityPlatformInvitationCreatedNotificationBuilder,
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
    CommunityInvitationVirtualContributorCreatedNotificationBuilder,
    SpaceCreatedNotificationBuilder,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
