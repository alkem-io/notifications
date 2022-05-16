import { Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { AspectCommentCreatedEventPayload } from '@common/dto';
import { NotificationBuilder, RoleConfig } from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { UserPreferenceType } from '@alkemio/client-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { User } from '@core/models';
import { ASPECT_CREATED } from '@src/common';

@Injectable()
export class AspectCommentCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<AspectCommentCreatedEventPayload>
  ) {}
  build(
    payload: AspectCommentCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType:
          UserPreferenceType.NotificationAspectCommentCreatedAdmin,
        emailTemplate: EmailTemplate.ASPECT_COMMENT_CREATED_ADMIN,
      },
      {
        role: 'owner',
        preferenceType: UserPreferenceType.NotificationAspectCommentCreated,
        emailTemplate: EmailTemplate.ASPECT_COMMENT_CREATED_MEMBER,
      },
    ];

    const lookupMap = new Map([
      ['hubID', ''],
      ['challengeID', ''],
      ['opportunityID', ''],
      ['ownerID', ''],
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
    eventPayload: AspectCommentCreatedEventPayload,
    recipient: User,
    owner?: User
  ): Record<string, unknown> {
    if (!owner) {
      throw Error(`Owner not provided for '${ASPECT_CREATED} event'`);
    }

    return {};
  }
}
