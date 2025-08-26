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
  UserSpaceCommunityJoinedNotificationBuilder,
  SpaceCollaborationCalloutContributionNotificationBuilder,
  SpaceCollaborationCalloutPostContributionCommentNotificationBuilder,
  SpaceCollaborationCalloutPublishedNotificationBuilder,
  UserSignUpWelcomeNotificationBuilder,
  PlatformAdminUserProfileRemovedNotificationBuilder,
  SpaceAdminCommunicationMessageDirectNotificationBuilder,
  UserMentionNotificationBuilder,
  OrganizationMentionNotificationBuilder,
  SpaceAdminCommunityApplicationReceivedNotificationBuilder,
  SpaceCommunicationUpdateNotificationBuilder,
  UserMessageRecipientNotificationBuilder,
  OrganizationMessageRecipientNotificationBuilder,
  UserMessageSenderNotificationBuilder,
  OrganizationMessageSenderNotificationBuilder,
  UserSpaceCommunityApplicationSubmittedNotificationBuilder,
  PlatformForumDiscussionCommentNotificationBuilder,
  SpaceAdminCommunityNewMemberNotificationBuilder,
} from './services/domain/builders';
import { NotificationService } from './services/domain/notification/notification.service';
import { SpaceCollaborationCalloutCommentNotificationBuilder } from './services/domain/builders/space/space.collaboration.callout.comment.notification.builder';
import { UserSpaceCommunityInvitationReceivedNotificationBuilder } from './services/domain/builders/user/user.space.community.invitation.received.notification.builder';
import { UserCommentReplyNotificationBuilder } from './services/domain/builders/user/user.comment.reply.notification.builder';
import { SpaceCommunityInvitationPlatformCreatedNotificationBuilder } from './services/domain/builders/user/space.community.invitation.platform.created.notification.builder';
import { PlatformAdminGlobalRoleChangeNotificationBuilder } from './services/domain/builders/platform/platform.admin.global.role.change.notification.builder';
import { VirtualContributorSpaceCommunityInvitationReceivedNotificationBuilder } from './services/domain/builders/virtual-contributor/virtual.contributor.space.community.invitation.received.notification.builder';
import { HealthController } from './health.controller';
import { PlatformAdminSpaceCreatedNotificationBuilder } from './services/domain/builders/platform/platform.admin.space.created.notification.builder';
import { PlatformAdminUserProfileCreatedNotificationBuilder } from './services/domain/builders/platform/platform.admin.user.profile.created.notification.builder';
import { SpaceCommunicationMessageDirectSenderNotificationBuilder } from './services/domain/builders/space/space.communication.message.direct.sender.notification.builder';
import { NotifmeModule } from './services/external/notifme/notifme.module';
import { NotificationTemplateBuilder } from './services/external/notifme/notification.templates.builder';
import { SpaceAdminCollaborationCalloutContributionNotificationBuilder } from './services/domain/builders/space/space.admin.collaboration.callout.contribution.notification.builder';

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
    SpaceAdminCommunityApplicationReceivedNotificationBuilder,
    UserSpaceCommunityApplicationSubmittedNotificationBuilder,
    UserSpaceCommunityInvitationReceivedNotificationBuilder,
    SpaceCommunityInvitationPlatformCreatedNotificationBuilder,
    SpaceAdminCommunicationMessageDirectNotificationBuilder,
    SpaceAdminCollaborationCalloutContributionNotificationBuilder,
    SpaceCommunicationMessageDirectSenderNotificationBuilder,
    SpaceCommunicationUpdateNotificationBuilder,
    UserSpaceCommunityJoinedNotificationBuilder,
    SpaceAdminCommunityNewMemberNotificationBuilder,
    VirtualContributorSpaceCommunityInvitationReceivedNotificationBuilder,
    SpaceCollaborationCalloutCommentNotificationBuilder,
    SpaceCollaborationCalloutContributionNotificationBuilder,
    SpaceCollaborationCalloutPostContributionCommentNotificationBuilder,
    SpaceCollaborationCalloutPublishedNotificationBuilder,
    PlatformAdminGlobalRoleChangeNotificationBuilder,
    UserSignUpWelcomeNotificationBuilder,
    PlatformAdminUserProfileCreatedNotificationBuilder,
    PlatformAdminUserProfileRemovedNotificationBuilder,
    PlatformForumDiscussionCreatedNotificationBuilder,
    PlatformForumDiscussionCommentNotificationBuilder,
    PlatformAdminSpaceCreatedNotificationBuilder,
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
