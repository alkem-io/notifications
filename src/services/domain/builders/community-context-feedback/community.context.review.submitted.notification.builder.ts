import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_ADAPTER,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common';
import { AlkemioClientAdapter } from '@src/services';
import { NotificationTemplateBuilder } from '@src/services/external';
import { INotificationRecipientTemplateProvider } from '@core/contracts';
import {
  CommunityContextReviewSubmittedPayload,
  FeedbackQuestions,
} from '@common/dto';
import { EmailTemplate } from '@common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';

@Injectable()
export class CommunityContextReviewSubmittedNotificationBuilder {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly alkemioAdapter: AlkemioClientAdapter,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  async buildNotifications(
    eventPayload: CommunityContextReviewSubmittedPayload
  ) {
    this.logger.verbose?.(
      `[Notifications: community review submitted]: ${JSON.stringify(
        eventPayload
      )}`,
      LogContext.NOTIFICATIONS
    );

    const reviewer = await this.alkemioAdapter.getUser(eventPayload.userId);

    const adminNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'admin',
      EmailTemplate.COMMUNITY_REVIEW_SUBMITTED_ADMIN,
      reviewer,
      UserPreferenceType.NotificationCommunityReviewSubmittedAdmin
    );

    const reviewerNotificationPromises = await this.buildNotificationsForRole(
      eventPayload,
      'reviewer',
      EmailTemplate.COMMUNITY_REVIEW_SUBMITTED_REVIEWER,
      reviewer,
      UserPreferenceType.NotificationCommunityReviewSubmitted
    );

    return Promise.all([
      ...adminNotificationPromises,
      ...reviewerNotificationPromises,
    ]);
  }

  async buildNotificationsForRole(
    eventPayload: CommunityContextReviewSubmittedPayload,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    reviewer: User,
    preferenceType?: UserPreferenceType
  ): Promise<any> {
    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - recipients role: '${recipientRole}'`,
      LogContext.NOTIFICATIONS
    );
    // Get the lookup map
    const lookupMap = this.createLookupMap(eventPayload);
    const userRegistrationRuleSets =
      this.recipientTemplateProvider.getTemplate().community_review_submitted;

    const credentialCriterias =
      this.recipientTemplateProvider.getCredentialCriteria(
        lookupMap,
        userRegistrationRuleSets,
        recipientRole
      );

    const recipients =
      await this.alkemioAdapter.getUniqueUsersMatchingCredentialCriteria(
        credentialCriterias
      );

    const filteredRecipients: User[] = [];
    for (const recipient of recipients) {
      if (recipient.preferences) {
        if (
          !preferenceType ||
          recipient.preferences.find(
            preference =>
              preference.definition.type === preferenceType &&
              preference.value === 'true'
          )
        )
          filteredRecipients.push(recipient);
      }
    }

    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - identified ${filteredRecipients.length} recipients`,
      LogContext.NOTIFICATIONS
    );

    const notifications = filteredRecipients.map(recipient =>
      this.buildNotification(eventPayload, recipient, emailTemplate, reviewer)
    );

    this.logger.verbose?.(
      `Notifications [${emailTemplate}] - completed`,
      LogContext.NOTIFICATIONS
    );

    return notifications;
  }

  async buildNotification(
    eventPayload: any,
    recipient: User,
    templateName: string,
    reviewer: User
  ) {
    const templatePayload = this.createTemplatePayload(
      eventPayload,
      recipient,
      reviewer
    ) as any;

    const populatedNotification =
      await this.notificationTemplateBuilder.buildTemplate(
        templateName,
        templatePayload
      );

    return populatedNotification;
  }

  createTemplatePayload(
    eventPayload: CommunityContextReviewSubmittedPayload,
    recipient: User,
    reviewer: User
  ): any {
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

  createLookupMap(
    payload: CommunityContextReviewSubmittedPayload
  ): Map<string, string> {
    const lookupMap: Map<string, string> = new Map();
    lookupMap.set('userID', payload.userId);
    lookupMap.set('challengeID', payload.challengeId);
    lookupMap.set('reviewerID', payload.userId);
    return lookupMap;
  }
}

const toStringReview = (questions: FeedbackQuestions[]): string =>
  questions.reduce<string>(
    (acc, curr) => acc.concat(`${curr.name}\n${curr.value}\n`),
    ''
  );
