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
  CollaborationContextReviewSubmittedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  CollaborationInterestNotificationBuilder,
  CollaborationCardCreatedNotificationBuilder,
  CollaborationCardCommentNotificationBuilder,
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
  AlkemioUrlGeneratorModule,
  NotificationBuilder,
} from './services/application';
import { CollaborationCanvasCreatedNotificationBuilder } from './services/domain/builders/collaboration-canvas-created/collaboration.canvas.created.notification.builder';
import { CollaborationDiscussionCommentNotificationBuilder } from './services/domain/builders/collaboration-discussion-comment/collaboration.discussion.comment.notification.builder';
import { CommunityInvitationCreatedNotificationBuilder } from './services/domain/builders/community-invitation-created/community.invitation.created.notification.builder';
import { CommentReplyNotificationBuilder } from './services/domain/builders/comment-reply/comment.reply.notification.builder';

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
    CommunityApplicationCreatedNotificationBuilder,
    CommunityInvitationCreatedNotificationBuilder,
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
    CollaborationContextReviewSubmittedNotificationBuilder,
    CommunityNewMemberNotificationBuilder,
    CollaborationInterestNotificationBuilder,
    CollaborationCanvasCreatedNotificationBuilder,
    CollaborationCardCreatedNotificationBuilder,
    CollaborationCardCommentNotificationBuilder,
    CollaborationDiscussionCommentNotificationBuilder,
    CollaborationCalloutPublishedNotificationBuilder,
    CommentReplyNotificationBuilder,
    NotificationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
