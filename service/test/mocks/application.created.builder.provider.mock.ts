import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { CommunityApplicationCreatedNotificationBuilder } from '@src/services';

export const MockApplicationCreatedBuilderProvider: ValueProvider<
  PublicPart<CommunityApplicationCreatedNotificationBuilder>
> = {
  provide: CommunityApplicationCreatedNotificationBuilder,
  useValue: {
    build: jest.fn(),
  },
};
