import { Inject, Injectable } from '@nestjs/common';
import { NotificationEventType } from '@alkemio/notifications-lib/dist/notification.event.type';
import { INotificationBuilder } from '@core/contracts';
import {
  CommunityContextReviewSubmittedPayload,
  FeedbackQuestions,
} from '@alkemio/notifications-lib/dist/dto';
import { EmailTemplate } from '@common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';
import {
  AlkemioUrlGenerator,
  NotificationBuilder,
  RoleConfig,
} from '../../../application';
import { NotificationTemplateType } from '@src/types';
import { CommunityContextEmailPayload } from '@common/email-template-payload';
import { ALKEMIO_URL_GENERATOR } from '@src/common/enums';

@Injectable()
export class CommunityContextReviewSubmittedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    @Inject(ALKEMIO_URL_GENERATOR)
    private readonly alkemioUrlGenerator: AlkemioUrlGenerator,
    private readonly notificationBuilder: NotificationBuilder<
      CommunityContextReviewSubmittedPayload,
      CommunityContextEmailPayload
    >
  ) {}

  build(
    payload: CommunityContextReviewSubmittedPayload
  ): Promise<NotificationTemplateType[]> {
    const roleConfig: RoleConfig[] = [
      {
        role: 'admin',
        emailTemplate: EmailTemplate.COMMUNITY_REVIEW_SUBMITTED_ADMIN,
        preferenceType:
          UserPreferenceType.NotificationCommunityReviewSubmittedAdmin,
      },
      {
        role: 'reviewer',
        emailTemplate: EmailTemplate.COMMUNITY_REVIEW_SUBMITTED_REVIEWER,
        preferenceType: UserPreferenceType.NotificationCommunityReviewSubmitted,
      },
    ];

    const templateVariables = {
      userID: payload.userId,
      challengeID: payload.challengeId,
      reviewerID: payload.userId,
    };

    return this.notificationBuilder.build({
      payload,
      eventUserId: payload.userId,
      roleConfig,
      templateType: 'community_review_submitted',
      templateVariables,
      templatePayloadBuilderFn: this.createTemplatePayload.bind(this),
    });
  }

  createTemplatePayload(
    eventPayload: CommunityContextReviewSubmittedPayload,
    recipient: User,
    reviewer?: User
  ): CommunityContextEmailPayload {
    if (!reviewer) {
      throw Error(
        `Reviewer not provided for '${NotificationEventType.COMMUNITY_CONTEXT_REVIEW_SUBMITTED}' event`
      );
    }

    const notificationPreferenceURL =
      this.alkemioUrlGenerator.createUserNotificationPreferencesURL(
        recipient.nameID
      );

    const hubURL = this.alkemioUrlGenerator.createHubURL();

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
        name: eventPayload.community.name,
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
