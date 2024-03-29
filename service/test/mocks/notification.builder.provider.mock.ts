import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { NotificationBuilder } from '@src/services/application';

export const MockNotificationBuilderProvider: ValueProvider<
  PublicPart<NotificationBuilder<any, any>>
> = {
  provide: NotificationBuilder,
  useValue: {
    build: jest.fn(),
  },
};
