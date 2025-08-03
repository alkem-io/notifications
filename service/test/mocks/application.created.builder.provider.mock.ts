import { ValueProvider } from '@nestjs/common';
import { CommunityApplicationCreatedNotificationBuilder } from '@src/services/domain/builders/space/community.application.created.notification.builder';
import { PublicPart } from '@test/utils';

export const MockApplicationCreatedBuilderProvider: ValueProvider<
  PublicPart<CommunityApplicationCreatedNotificationBuilder>
> = {
  provide: CommunityApplicationCreatedNotificationBuilder,
  useValue: {
    getEventRecipientSets: jest.fn(),
    createEmailTemplatePayload: jest.fn(),
    createInAppTemplatePayload: jest.fn(),
  },
};
