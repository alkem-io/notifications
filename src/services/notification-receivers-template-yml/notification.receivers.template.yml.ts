import { Injectable } from '@nestjs/common';
import {
  INotificationRecipientTemplateProvider,
  TemplateConfig,
} from '@core/contracts/notification.receiver.template.provider.interface';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common';

@Injectable()
export class NotificationRecipientsYmlTemplate
  implements INotificationRecipientTemplateProvider
{
  constructor(private readonly configService: ConfigService) {}

  getTemplate(): TemplateConfig {
    // todo validate template?
    return (
      this.configService.get(ConfigurationTypes.NOTIFICATION_RECIPIENTS) ??
      ({} as TemplateConfig)
    );
  }
}
