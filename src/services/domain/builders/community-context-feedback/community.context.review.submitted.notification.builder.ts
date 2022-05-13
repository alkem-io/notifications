import { Injectable } from '@nestjs/common';
import { COMMUNITY_CONTEXT_REVIEW_SUBMITTED } from '@src/common';
import { INotificationBuilder } from '@core/contracts';
import {
  CommunityContextReviewSubmittedPayload,
  FeedbackQuestions,
} from '@common/dto';
import { EmailTemplate } from '@common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';
// todo
import {
  NotificationBuilder,
  RoleConfig,
} from '@src/services/application/notification-builder/notification.builder1';
import { NotificationTemplateType } from '@src/types';

@Injectable()
export class CommunityContextReviewSubmittedNotificationBuilder
  implements INotificationBuilder
{
  constructor(
    private readonly notificationBuilder: NotificationBuilder<CommunityContextReviewSubmittedPayload>
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
  ): any {
    if (!reviewer) {
      throw Error(
        `Reviewer not provided for '${COMMUNITY_CONTEXT_REVIEW_SUBMITTED}' event`
      );
    }

    return {
      emailFrom: 'info@alkem.io',
      reviewer: {
        name: reviewer.displayName,
      },
      recipient: {
        name: recipient.displayName,
        firstname: recipient.firstName,
        email: recipient.email,
      },
      community: {
        name: eventPayload.community.name,
      },
      review: toStringReview(eventPayload.questions),
    };
  }
}

const toStringReview = (questions: FeedbackQuestions[]): string =>
  questions.reduce<string>(
    (acc, curr) => acc.concat(`${curr.name}\n${curr.value}\n`),
    ''
  );
