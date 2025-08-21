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
  SpaceCommunityNewMemberNotificationBuilder,
  SpaceCollaborationPostCreatedMemberNotificationBuilder,
  SpaceCollaborationPostCommentNotificationBuilder,
  SpaceCollaborationCalloutPublishedNotificationBuilder,
  PlatformUserRegisteredNotificationBuilder,
  PlatformUserRemovedNotificationBuilder,
  SpaceCommunicationMessageDirectRecipientNotificationBuilder,
  UserMentionNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  SpaceCommunityApplicationCreatedAdminNotificationBuilder,
  SpaceCommunicationUpdateMemberNotificationBuilder,
  UserMessageRecipientNotificationBuilder,
  OrganizationMessageRecipientNotificationBuilder,
  UserMessageSenderNotificationBuilder,
  OrganizationMessageSenderNotificationBuilder,
  SpaceCommunityApplicationApplicantNotificationBuilder,
  SpaceCommunicationUpdateAdminNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  SpaceCommunityNewMemberAdminNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import { SpaceCollaborationWhiteboardCreatedNotificationBuilder } from './services/domain/builders/space/space.collaboration.whiteboard.created.notification.builder';
import { SpaceCommunityInvitationCreatedInviteeNotificationBuilder } from './services/domain/builders/space/space.community.invitation.created.notification.builder';
import { UserCommentReplyNotificationBuilder } from './services/domain/builders/user/user.comment.reply.notification.builder';
import { SpaceCommunityInvitationPlatformCreatedNotificationBuilder } from './services/domain/builders/space/space.community.invitation.platform.created.notification.builder';
import { AlkemioUrlGeneratorModule } from './services/application/alkemio-url-generator/alkemio.url.generator.module';
import { PlatformGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform/platform.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from './services/domain/builders/space/space.community.invitation.virtual.contributor.created.notification.builder';
import { HealthController } from './health.controller';
import { PlatformSpaceCreatedNotificationBuilder } from './services/domain/builders/platform/platform.space.created.notification.builder';
import { AlkemioUrlGenerator } from './services/application/alkemio-url-generator/alkemio.url.generator';
import { PlatformUserRegisteredAdminNotificationBuilder } from './services/domain/builders/platform/platform.user.registered.admin.notification.builder';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from './services/domain/builders/space/space.communication.message.direct.sender.notification.builder';

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
    NotificationService,
    AlkemioUrlGenerator,
    SpaceCommunityApplicationCreatedAdminNotificationBuilder,
    SpaceCommunityApplicationApplicantNotificationBuilder,
    SpaceCommunityInvitationCreatedInviteeNotificationBuilder,
    SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    SpaceCommunicationMessageDirectRecipientNotificationBuilder,
    SpaceCommunicationMessageDirectSenderNotificationBuilder,
    SpaceCommunicationUpdateMemberNotificationBuilder,
    SpaceCommunityNewMemberNotificationBuilder,
    SpaceCommunityNewMemberAdminNotificationBuilder,
    SpaceCommunicationUpdateAdminNotificationBuilder,
    SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder,
    SpaceCollaborationWhiteboardCreatedNotificationBuilder,
    SpaceCollaborationPostCreatedMemberNotificationBuilder,
    SpaceCollaborationPostCommentNotificationBuilder,
    SpaceCollaborationCalloutPublishedNotificationBuilder,
    PlatformGlobalRoleChangeNotificationBuilder,
    PlatformUserRegisteredNotificationBuilder,
    PlatformUserRegisteredAdminNotificationBuilder,
    PlatformUserRemovedNotificationBuilder,
    PlatformForumDiscussionCreatedNotificationBuilder,
    PlatformForumDiscussionCommentNotificationBuilder,
    PlatformSpaceCreatedNotificationBuilder,
    OrganizationMentionNotificationBuilder,
    OrganizationMessageRecipientNotificationBuilder,
    OrganizationMessageSenderNotificationBuilder,
    UserMessageRecipientNotificationBuilder,
    UserMessageSenderNotificationBuilder,
    UserMentionNotificationBuilder,
    UserCommentReplyNotificationBuilder,
  ],
  controllers: [AppController, HealthController],
})
export class AppModule {}
