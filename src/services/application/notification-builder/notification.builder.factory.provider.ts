import { FactoryProvider, LoggerService, Scope } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationBuilder } from './notification.builder';
import {
  ALKEMIO_CLIENT_ADAPTER,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { AlkemioClientAdapter } from '@src/services';
import { NotificationTemplateBuilder } from '@src/services/external';
import { INotificationRecipientTemplateProvider } from '@core/contracts';

const NotificationBuilderFactory = (
  logger: LoggerService,
  alkemioAdapter: AlkemioClientAdapter,
  notificationTemplateBuilder: NotificationTemplateBuilder,
  recipientTemplateProvider: INotificationRecipientTemplateProvider
) => {
  return new NotificationBuilder(
    logger,
    alkemioAdapter,
    notificationTemplateBuilder,
    recipientTemplateProvider
  );
};
// it is request scoped due to the requirement to hold a state
// per request before calling the build method on it
export const NotificationBuilderFactoryProvider: FactoryProvider = {
  provide: NotificationBuilder,
  useFactory: NotificationBuilderFactory,
  inject: [
    WINSTON_MODULE_NEST_PROVIDER,
    ALKEMIO_CLIENT_ADAPTER,
    TEMPLATE_PROVIDER,
    NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  ],
  scope: Scope.REQUEST,
};
