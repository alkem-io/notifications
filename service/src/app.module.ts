import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
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
  PlatformForumDiscussionCommentNotificationBuilder,
  SpaceCommunityNewMemberAdminNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import { SpaceCollaborationWhiteboardCreatedNotificationBuilder } from './services/domain/builders/space/space.collaboration.callout.comment.notification.builder';
import { USERSpaceCommunityInvitationReceivedNotificationBuilder } from './services/domain/builders/user/user.space.community.invitation.received.notification.builder';
import { UserCommentReplyNotificationBuilder } from './services/domain/builders/user/user.comment.reply.notification.builder';
import { SpaceCommunityInvitationPlatformCreatedNotificationBuilder } from './services/domain/builders/space/space.community.invitation.platform.created.notification.builder';
import { PlatformGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform/platform.global.role.change.notification.builder';
import { SpaceCommunityInvitationVirtualContributorCreatedNotificationBuilder } from './services/domain/builders/virtual-contributor/virtual.contributor.space.community.invitation.received.notification.builder';
import { HealthController } from './health.controller';
import { PlatformSpaceCreatedNotificationBuilder } from './services/domain/builders/platform/platform.space.created.notification.builder';
import { PlatformUserRegisteredAdminNotificationBuilder } from './services/domain/builders/platform/platform.user.registered.admin.notification.builder';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from './services/domain/builders/space/space.communication.message.direct.sender.notification.builder';
import { NotifmeModule } from './services/external/notifme/notifme.module';
import { NotificationTemplateBuilder } from './services/external/notifme/notification.templates.builder';

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
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    NotificationTemplateBuilder,
    NotificationService,
    SpaceCommunityApplicationCreatedAdminNotificationBuilder,
    SpaceCommunityApplicationApplicantNotificationBuilder,
    USERSpaceCommunityInvitationReceivedNotificationBuilder,
    SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    SpaceCommunicationMessageDirectRecipientNotificationBuilder,
    SpaceCommunicationMessageDirectSenderNotificationBuilder,
    SpaceCommunicationUpdateMemberNotificationBuilder,
    SpaceCommunityNewMemberNotificationBuilder,
    SpaceCommunityNewMemberAdminNotificationBuilder,
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
