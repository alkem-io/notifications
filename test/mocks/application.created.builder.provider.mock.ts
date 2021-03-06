import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { ApplicationCreatedNotificationBuilder } from '@src/services';

export const MockApplicationCreatedBuilderProvider: ValueProvider<
  PublicPart<ApplicationCreatedNotificationBuilder>
> = {
  provide: ApplicationCreatedNotificationBuilder,
  useValue: {
    build: jest.fn(),
  },
};
