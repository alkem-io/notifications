import { Inject, Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib';
import { INotificationBuilder } from '@core/contracts';
import {
  CollaborationContextReviewSubmittedPayload,
  FeedbackQuestions,
} from '@alkemio/notifications-lib';
import { EmailTemplate } from '@common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';
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
    recipient: User,
    reviewer?: User
  ): CollaborationContextReviewEmailPayload {
    if (!reviewer) {
      throw Error(
        `Reviewer not provided for '${NotificationEventType.COLLABORATION_CONTEXT_REVIEW_SUBMITTED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createPlatformURL();

    return {
      emailFrom: 'info@alkem.io',
      reviewer: {
        name: reviewer.displayName,
      },
      recipient: {
        firstname: recipient.firstName,
        email: recipient.email,
        notificationPreferences: notificationPreferenceURL,
      },
      community: {
        name: eventPayload.journey.displayName,
      },
      review: toStringReview(eventPayload.questions),
      hub: {
        url: hubURL,
      },
    };
  }
}

const toStringReview = (questions: FeedbackQuestions[]): string =>
  questions.reduce<string>(
    (acc, curr) => acc.concat(`${curr.name}\n${curr.value}\n`),
    ''
  );
