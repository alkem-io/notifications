import { ValueProvider } from '@nestjs/common';
import { SpaceAdminCommunityApplicationReceivedNotificationBuilder } from '@src/services/domain/builders/space/space.admin.community.application.received.notification.builder';
import { PublicPart } from '@test/utils';

export const MockApplicationCreatedBuilderProvider: ValueProvider<
  PublicPart<SpaceAdminCommunityApplicationReceivedNotificationBuilder>
> = {
  provide: SpaceAdminCommunityApplicationReceivedNotificationBuilder,
  useValue: {
    createEmailTemplatePayload: jest.fn(),
  },
};
