import { ValueProvider } from '@nestjs/common';
import { SpaceCommunityApplicationCreatedAdminNotificationBuilder } from '@src/services/domain/builders/space/space.community.application.created.admin.notification.builder';
import { PublicPart } from '@test/utils';

export const MockApplicationCreatedBuilderProvider: ValueProvider<
  PublicPart<SpaceCommunityApplicationCreatedAdminNotificationBuilder>
> = {
  provide: SpaceCommunityApplicationCreatedAdminNotificationBuilder,
  useValue: {
    createEmailTemplatePayload: jest.fn(),
  },
};
