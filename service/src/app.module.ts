import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import {
  AlkemioClientAdapter,
  AlkemioClientAdapterModule,
} from '@src/services';
import {
  AlkemioClientModule,
  NotificationTemplateBuilder,
  NotifmeModule,
} from '@src/services/external';
import {
  PlatformForumDiscussionCreatedNotificationBuilder,
  CommunityNewMemberNotificationBuilder,
  SpaceCollaborationPostCreatedMemberNotificationBuilder,
  CollaborationPostCommentNotificationBuilder,
  SpaceCollaborationCalloutPublishedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
  PlatformUserRemovedNotificationBuilder,
  SpaceCommunicationLeadsMessageRecipientNotificationBuilder,
  UserMentionNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  SpaceCommunityApplicationCreatedAdminNotificationBuilder,
  SpaceCommunicationUpdateMemberNotificationBuilder,
  UserMessageRecipientNotificationBuilder,
  OrganizationMessageRecipientNotificationBuilder,
  UserMessageSenderNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import { SpaceCollaborationWhiteboardCreatedNotificationBuilder } from './services/domain/builders/space/space.collaboration.whiteboard.created.notification.builder';
import { SpaceCommunityInvitationCreatedInviteeNotificationBuilder } from './services/domain/builders/space/space.community.invitation.created.notification.builder';
import { UserCommentReplyNotificationBuilder } from './services/domain/builders/user/user.comment.reply.notification.builder';
import { CommunityPlatformInvitationCreatedNotificationBuilder } from './services/domain/builders/space/space.community.platform.invitation.created.notification.builder';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator/alkemio.url.generator.module';
import { PlatformGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform/platform.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from './services/domain/builders/space/space.community.invitation.virtual.contributor.created.notification.builder';
import { HealthController } from './health.controller';
import { PlatformSpaceCreatedNotificationBuilder } from './services/domain/builders/platform/platform.space.created.notification.builder';

import { InAppDispatcher } from './services/dispatchers/in-app';
import { AlkemioUrlGenerator } from './services/application/alkemio-url-generator/alkemio.url.generator';

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
    SpaceCommunityApplicationCreatedAdminNotificationBuilder,
    SpaceCommunityInvitationCreatedInviteeNotificationBuilder,
    CommunityPlatformInvitationCreatedNotificationBuilder,
    PlatformGlobalRoleChangeNotificationBuilder,
    PlatformUserRegisteredNotificationBuilder,
    PlatformUserRemovedNotificationBuilder,
    SpaceCommunicationUpdateMemberNotificationBuilder,
    PlatformForumDiscussionCreatedNotificationBuilder,
    UserMessageRecipientNotificationBuilder,
    UserMessageSenderNotificationBuilder,
    OrganizationMessageRecipientNotificationBuilder,
    SpaceCommunicationLeadsMessageRecipientNotificationBuilder,
    UserMentionNotificationBuilder,
    OrganizationMentionNotificationBuilder,
    CommunityNewMemberNotificationBuilder,
    SpaceCollaborationWhiteboardCreatedNotificationBuilder,
    SpaceCollaborationPostCreatedMemberNotificationBuilder,
    CollaborationPostCommentNotificationBuilder,
    SpaceCollaborationCalloutPublishedNotificationBuilder,
    UserCommentReplyNotificationBuilder,
    NotificationService,
    SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
    PlatformSpaceCreatedNotificationBuilder,
    //
    InAppDispatcher,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
