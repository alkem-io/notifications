import { Injectable } from '@nestjs/common';
import {
  INotificationRecipientTemplateProvider,
  TemplateConfig,
} from '@core/contracts';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes } from '@src/common';

@Injectable()
export class NotificationRecipientsYmlAdapter
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
