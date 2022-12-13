import { Inject, Injectable } from '@nestjs/common';
import { INotificationBuilder } from '@core/contracts';
import { CollaborationCanvasCreatedEventPayload } from '@alkemio/notifications-lib';
import { UserPreferenceType } from '@alkemio/client-lib';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application';
import { NotificationTemplateType } from '@src/types';
import { User } from '@core/models';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { EmailTemplate } from '@common/enums/email.template';
import { CollaborationCanvasCreatedEmailPayload } from '@common/email-template-payload';
import { NotificationEventType } from '@alkemio/notifications-lib';

@Injectable()
export class CollaborationCanvasCreatedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationCanvasCreatedEventPayload,
      CollaborationCanvasCreatedEmailPayload
    >,
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator
  ) {}
  build(
    payload: CollaborationCanvasCreatedEventPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        preferenceType: UserPreferenceType.NotificationCanvasCreated,
        emailTemplate: EmailTemplate.COLLABORATION_CANVAS_CREATED_ADMIN,
      },
      {
        role: 'user',
        preferenceType: UserPreferenceType.NotificationCanvasCreated,
        emailTemplate: EmailTemplate.COLLABORATION_CANVAS_CREATED_MEMBER,
      },
    ];

    const templateVariables = {
      hubID: payload.journey.hubID,
      challengeID: payload.journey?.challenge?.id ?? '',
      opportunityID: payload.journey?.challenge?.opportunity?.id ?? '',
      journeyID:
        payload.journey?.challenge?.opportunity?.id ??
        payload.journey?.challenge?.id ??
        payload.journey.hubID,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.canvas.createdBy,
      roleConfig,
      templateType: 'collaboration_canvas_created',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationCanvasCreatedEventPayload,
    recipient: User,
    creator?: User
  ): CollaborationCanvasCreatedEmailPayload {
    if (!creator) {
      throw Error(
        `Creator not provided for '${NotificationEventType.COLLABORATION_CANVAS_CREATED} event'`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();
    const journeyURL = this.alkemioUrlGenerator.createJourneyURL(
      eventPayload.journey
    );
    const canvasURL = this.alkemioUrlGenerator.createCanvasURL(
      journeyURL,
      eventPayload.callout.nameID,
      eventPayload.canvas.nameID
    );
    const calloutURL = this.alkemioUrlGenerator.createCalloutURL(
      journeyURL,
      eventPayload.callout.nameID
    );

    return {
      emailFrom: 'info@alkem.io',
      createdBy: {
        firstName: creator.firstName,
        email: creator.email,
      },
      callout: {
        displayName: eventPayload.callout.displayName,
        url: calloutURL,
      },
      canvas: {
        displayName: eventPayload.canvas.displayName,
        url: canvasURL,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      journey: {
        displayName: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: journeyURL,
      },
      platform: {
        url: alkemioURL,
      },
    };
  }
}
