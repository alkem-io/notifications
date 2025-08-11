import { BaseEventPayload } from '@alkemio/notifications-lib';
import { PlatformUser, User } from '../../../core/models/user';
import { BaseEmailPayload } from '@src/common/email-template-payload';
import { EmailTemplate } from '@src/common/enums/email.template';
export interface INotificationBuilder {
  emailTemplate: EmailTemplate;

  createEmailTemplatePayload(
    eventPayload: BaseEventPayload,
    recipient: User | PlatformUser
  ): BaseEmailPayload;
}
