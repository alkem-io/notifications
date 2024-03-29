import { Inject, Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import {
  CollaborationContextReviewSubmittedPayload,
  FeedbackQuestions,
} from '@alkemio/notifications-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { ExternalUser, User } from '@core/models';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CollaborationContextReviewEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums';

@Injectable()
export class CollaborationContextReviewSubmittedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CollaborationContextReviewSubmittedPayload,
      CollaborationContextReviewEmailPayload
    >
  ) {}

  build(
    payload: CollaborationContextReviewSubmittedPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.COLLABORATION_REVIEW_SUBMITTED_ADMIN,
        preferenceType:
          UserPreferenceType.NotificationCommunityReviewSubmittedAdmin,
      },
      {
        role: 'reviewer',
        emailTemplate: EmailTemplate.COLLABORATION_REVIEW_SUBMITTED_REVIEWER,
        preferenceType: UserPreferenceType.NotificationCommunityReviewSubmitted,
      },
    ];

    const templateVariables = {
      userID: payload.triggeredBy,
      challengeID: payload.journey.challenge?.id || '',
      reviewerID: payload.triggeredBy,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.triggeredBy,
      roleConfig,
      templateType: 'collaboration_review_submitted',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CollaborationContextReviewSubmittedPayload,
    recipient: User | ExternalUser,
    reviewer?: User
  ): CollaborationContextReviewEmailPayload {
    if (!reviewer) {
      throw Error(
        `Reviewer not provided for '${NotificationEventType.COLLABORATION_CONTEXT_REVIEW_SUBMITTED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(recipient);

    const alkemioURL = this.alkemioUrlGenerator.createPlatformURL();

    return {
      emailFrom: 'info@alkem.io',
      reviewer: {
        name: reviewer.profile.displayName,
      },
      recipient: {
        firstName: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      journey: {
        displayName: eventPayload.journey.displayName,
        type: eventPayload.journey.type,
        url: this.alkemioUrlGenerator.createJourneyURL(eventPayload.journey),
      },
      review: toStringReview(eventPayload.questions),
      platform: {
        url: alkemioURL,
      },
    };
  }
}

const toStringReview = (questions: FeedbackQuestions[]): string =>
  questions.reduce<string>(
    (acc, curr) => acc.concat(`${curr.name}\n${curr.value}\n`),
    ''
  );
