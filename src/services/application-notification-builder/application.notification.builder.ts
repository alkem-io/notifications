import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ALKEMIO_CLIENT_ADAPTER, TEMPLATE_PROVIDER } from '@src/common';
import { NotificationTemplateBuilder } from '@src/wrappers/notifme/notification.templates.builder';
import {
  INotificationRecipientProvider,
  INotifiedUsersProvider,
} from '@core/contracts';
import { NotificationReceiversYml } from '../notification-receiver-yml/notification.receivers.yml';
import { User } from '@core/models';

@Injectable()
export class ApplicationNotificationBuilder {
  constructor(
    @Inject(NotificationReceiversYml)
    private readonly notificationReceiverYaml: INotificationRecipientProvider,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly notifiedUsersService: INotifiedUsersProvider,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder
  ) {}

  async buildNotifications(payload: any): Promise<any> {
    const notifications = [];

    const applicant = await this.notifiedUsersService.getApplicant(payload);
    const notification = await this.buildUserNotification(payload, applicant);
    notifications.push(notification);

    await this.buildHubAdminsNotifications(payload, applicant, notifications);
    await this.buildChallengeAdminsNotifications(
      payload,
      applicant,
      notifications
    );
    await this.buildOpportunityAdminsNotifications(
      payload,
      applicant,
      notifications
    );

    return notifications;
  }

  async buildAdminsNotifications(
    applicant: User,
    admins: User[],
    community: any,
    notifications: any
  ) {
    for (const admin of admins) {
      const notification = await this.buildAdminNotification({
        admin: admin,
        applicant: applicant,
        community: community,
      });
      notifications.push(notification);
    }
  }

  async buildHubAdminsNotifications(
    payload: any,
    applicant: User,
    notifications: any
  ) {
    const hubAdmins = await this.notifiedUsersService.getHubAdmins(
      payload.hub.id
    );

    await this.buildAdminsNotifications(
      applicant,
      hubAdmins,
      payload.community,
      notifications
    );
  }

  async buildChallengeAdminsNotifications(
    payload: any,
    applicant: User,
    notifications: any
  ) {
    const challengeAdmins = await this.notifiedUsersService.getChallengeAdmins(
      payload.hub.challenge.id
    );

    await this.buildAdminsNotifications(
      applicant,
      challengeAdmins,
      payload.community,
      notifications
    );
  }

  async buildOpportunityAdminsNotifications(
    payload: any,
    applicant: User,
    notifications: any
  ) {
    const opportunityAdmins =
      await this.notifiedUsersService.getOpportunityAdmins(
        payload.hub.challenge.opportunity.id
      );

    await this.buildAdminsNotifications(
      applicant,
      opportunityAdmins,
      payload.community,
      notifications
    );
  }

  async buildUserNotification(payload: any, applicant: User) {
    const mergedUserPayload = {
      emailFrom: '<info@alkem.io>',
      applicant: {
        name: applicant.displayName,
        email: applicant.email,
      },
      community: {
        name: payload.community.name,
        type: payload.community.type,
      },
    };

    return await this.buildNotification(
      mergedUserPayload,
      'user.application.applicant'
    );
  }

  async buildAdminNotification(payload: any) {
    const mergedAdminPayload = {
      emailFrom: '<info@alkem.io>',
      admin: {
        firstname: payload.admin.firstName,
        email: payload.admin.email,
      },
      applicant: {
        name: payload.applicant.displayName,
        email: payload.applicant.email,
      },
      community: {
        name: payload.community.name,
        type: payload.community.type,
      },
    };

    return await this.buildNotification(
      mergedAdminPayload,
      'user.application.admin'
    );
  }

  async buildNotification(payload: any, templateName: string) {
    const notification = await this.notificationTemplateBuilder.buildTemplate(
      templateName,
      payload
    );
    return notification;
  }
}
