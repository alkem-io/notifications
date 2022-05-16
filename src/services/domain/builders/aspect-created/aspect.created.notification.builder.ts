import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { AspectCreatedEventPayload } from '@common/dto';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { User } from '@core/models';
import { ASPECT_CREATED } from '@src/common';

@Injectable()
export class AspectCreatedNotificationBuilder implements INotificationBuilder {
  constructor(
    private readonly notificationBuilder: NotificationBuilder<AspectCreatedEventPayload>
  ) {}
  build(
    payload: AspectCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationAspectCreated,
        emailTemplate: EmailTemplate.ASPECT_CREATED_ADMIN,
      },
    ];

    const lookupMap = new Map([
      ['hubID', ''],
      ['challengeID', ''],
      ['opportunityID', ''],
    ]);

    return this.notificationBuilder
      .setPayload(payload)
      .setEventUser(payload.userID)
      .setRoleConfig(roleConfig)
      .setTemplateType('application_created')
      .setTemplateVariables(lookupMap)
      .setTemplateBuilderFn(this.createTemplatePayload.bind(this))
      .build();
  }

  createTemplatePayload(
    eventPayload: AspectCreatedEventPayload,
    recipient: User,
    applicant?: User
  ): Record<string, unknown> {
    if (!applicant) {
      throw Error(`Applicant not provided for '${ASPECT_CREATED} event'`);
    }

    return {};
  }
}
