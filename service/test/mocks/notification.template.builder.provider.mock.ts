import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { NotificationTemplateBuilder } from '@src/services/external';
import { TEMPLATE_PROVIDER } from '@common/enums';

export const MockNotificationTemplateBuilderProvider: ValueProvider<
  PublicPart<NotificationTemplateBuilder<any>>
> = {
  provide: TEMPLATE_PROVIDER,
  useValue: {
    buildTemplate: jest.fn(),
  },
};
