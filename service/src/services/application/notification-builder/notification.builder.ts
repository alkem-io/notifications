import { Inject, LoggerService } from '@nestjs/common';
import {
  EventPayloadNotProvidedException,
  RolesNotProvidedException,
  RuleSetNotFoundException,
  TemplateBuilderFnNotProvidedException,
} from '@common/exceptions';
import { AlkemioClientAdapter } from '@src/services';
import { EmailTemplate } from '@common/enums/email.template';
import { PreferenceType } from '@alkemio/client-lib';
import { PlatformUser, User } from '@core/models';
import {
  INotificationRecipientTemplateProvider,
  TemplateConfig,
} from '@core/contracts/notification.recipient.template.provider.interface';
import { NotificationTemplateBuilder } from '@src/services/external';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { BaseEmailPayload } from '@common/email-template-payload';
import { BaseEventPayload } from '@alkemio/notifications-lib';
import {
  ALKEMIO_CLIENT_ADAPTER,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  TEMPLATE_PROVIDER,
} from '@src/common/enums/providers';
import { LogContext } from '@src/common/enums';
import {
  filterCredentialCriterion,
  isCredentialCriterionPlatformUser,
} from '../template-to-credential-mapper/utils/utils';

export type RoleConfig = {
  role: string;
  emailTemplate: EmailTemplate;
  preferenceType?: PreferenceType;
  checkIsUserMessagingAllowed?: boolean;
};
export type TemplateType = keyof TemplateConfig;
export type TemplateBuilderFn<TPayload, TEmailPayload> = (
  payload: TPayload,
  recipient: User | PlatformUser,
  eventUser?: User
) => TEmailPayload;

export type NotificationOptions<
  TPayload extends BaseEventPayload,
  TEmailPayload extends BaseEmailPayload
> = {
  /** The received event payload */
  payload: TPayload;
  /** the name of the template in notifications.yml */
  templateType: TemplateType;
  /** payload builder function for the email template */
  templatePayloadBuilderFn: TemplateBuilderFn<TPayload, TEmailPayload>;
  /** configuration to which roles the notification must be sent */
  roleConfig: RoleConfig[];
  /** the creator of the event if any */
  eventUserId?: string;
  /** variables to be used into the chosen templateType if any */
  templateVariables?: Record<string, string>;
  /** New platform users to which email addresses the notification will be sent */
  platformUsers?: PlatformUser[];
};

export class NotificationBuilder<
  TPayload extends BaseEventPayload,
  TEmailPayload extends BaseEmailPayload
> {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder<TEmailPayload>,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  async build(
    options: NotificationOptions<TPayload, TEmailPayload>
  ): Promise<NotificationTemplateType[]> {
    const { payload, eventUserId, roleConfig, templateType } = options;
    this.logger.verbose?.(JSON.stringify(payload), LogContext.NOTIFICATIONS);
    // get the user related to that event
    const eventUser = eventUserId
      ? await this.alkemioAdapter.getUser(eventUserId)
      : undefined;

    if (!roleConfig.length) {
      throw new RolesNotProvidedException(
        `No roles are provided for template '${templateType}'`
      );
    }

    const notificationsForRoles: Promise<NotificationTemplateType[]>[] = [];
    roleConfig.forEach(
      ({
        role,
        emailTemplate,
        preferenceType,
        checkIsUserMessagingAllowed,
      }) => {
        const notifications: Promise<NotificationTemplateType[]> =
          this.buildNotificationsForRole(options, role, emailTemplate, {
            eventUser,
            rolePreferenceType: preferenceType,
            checkIsUserMessagingAllowed,
          });
        notificationsForRoles.push(notifications);
      }
    );

    // when the build process of all notification is finished
    // flatten the notification by role a single array of notifications
    // filters the rejected once and log them
    const notifications = await Promise.allSettled(notificationsForRoles);
    const notificationResults: NotificationTemplateType[] = [];
    notifications.forEach(notification => {
      if (isPromiseFulfilledResult(notification)) {
        notificationResults.push(...notification.value);
      } else {
        this.logger.warn(
          `Filtering rejected notification content: ${notification.reason}`,
          LogContext.NOTIFICATIONS
        );
      }
    });
    return notificationResults;
  }

  private async buildNotificationsForRole(
    options: NotificationOptions<TPayload, TEmailPayload>,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    extra?: {
      eventUser?: User;
      rolePreferenceType?: PreferenceType;
      checkIsUserMessagingAllowed?: boolean;
      // how to query the settings and is it the best idea
    }
  ): Promise<NotificationTemplateType[]> {
    const { templateType, roleConfig, templateVariables, platformUsers } =
      options;
    this.logger.verbose?.(
      `[${emailTemplate} - '${recipientRole}'] Building notifications - start'`,
      LogContext.NOTIFICATIONS
    );
    // validate early
    if (extra?.rolePreferenceType && extra?.checkIsUserMessagingAllowed) {
      throw new Error(
        'You cannot use both "rolePreferenceType" and "checkIsUserMessagingAllowed" at the same time'
      );
    }

    const ruleSets =
      this.recipientTemplateProvider.getTemplate()?.[templateType];

    if (!ruleSets) {
      const rolesText = roleConfig.map(x => x.role).join(',');
      throw new RuleSetNotFoundException(
        `No rule set(s) found for roles: [${rolesText}]`
      );
    }
    const variableMap = templateVariables
      ? new Map<string, string>(
          Object.keys(templateVariables).map(x => [x, templateVariables[x]])
        )
      : undefined;

    const credentialCriteria =
      this.recipientTemplateProvider.getCredentialCriteria(
        recipientRole,
        variableMap,
        ruleSets
      );

    const filteredCriteria = filterCredentialCriterion(credentialCriteria);

    const recipients =
      await this.alkemioAdapter.getUniqueUsersMatchingCredentialCriteria(
        filteredCriteria,
        !!extra?.rolePreferenceType,
        !!extra?.checkIsUserMessagingAllowed
      );

    const externalRecipients: PlatformUser[] = [];

    if (
      isCredentialCriterionPlatformUser(credentialCriteria) &&
      platformUsers
    ) {
      externalRecipients.push(...platformUsers);
    }

    if (!recipients.length && !externalRecipients) {
      const criteriaText = credentialCriteria
        .map(x => `<${x.type},${x.resourceID}>`)
        .join(' OR ');
      this.logger.verbose?.(
        `Unable to find recipients matching ${criteriaText}`,
        LogContext.NOTIFICATIONS
      );
      return [];
    }

    this.logger.verbose?.(
      `[${emailTemplate} - '${recipientRole}'] ...${
        recipients.length
      } recipients have matching credentials: ${JSON.stringify(
        recipients.map(user => user.email)
      )}`,
      LogContext.NOTIFICATIONS
    );

    const filteredRecipients: User[] = [];

    // filter by user preferences
    if (extra?.rolePreferenceType) {
      for (const recipient of recipients) {
        const targetedUserPreference =
          recipient.preferences &&
          recipient.preferences.find(
            preference =>
              preference.definition.type === extra.rolePreferenceType
          );

        if (!targetedUserPreference) {
          this.logger.verbose?.(
            `[${emailTemplate} - '${recipientRole}'] ...skipping recipient ${recipient.nameID} - ${extra.rolePreferenceType} preference not found`
          );
          continue;
        }

        if (targetedUserPreference.value !== 'true') {
          this.logger.verbose?.(
            `[${emailTemplate} - '${recipientRole}'] User ${recipient.profile.displayName} filtered out because of ${extra?.rolePreferenceType}`,
            LogContext.NOTIFICATIONS
          );
          continue;
        }

        filteredRecipients.push(recipient);
      }
    } else if (extra?.checkIsUserMessagingAllowed) {
      // filter by user settings
      for (const recipient of recipients) {
        const { settings } = recipient;

        if (!settings) {
          this.logger.verbose?.(
            `[${emailTemplate} - '${recipientRole}'] ...skipping recipient ${recipient.nameID} - settings not found`
          );
          continue;
        }

        if (!settings.communication.allowOtherUsersToSendMessages) {
          this.logger.verbose?.(
            `[${emailTemplate} - '${recipientRole}'] ...skipping recipient ${recipient.nameID} - User has disabled messaging`
          );
          continue;
        }

        filteredRecipients.push(recipient);
      }
    } else {
      // not filtering - include all
      filteredRecipients.push(...recipients);
    }

    this.logger.verbose?.(
      `[${emailTemplate} - '${recipientRole}'] ...${
        filteredRecipients.length
      } recipients with valid credentials have preference enabled:  ${JSON.stringify(
        filteredRecipients.map(user => user.email)
      )}`,
      LogContext.NOTIFICATIONS
    );

    const notificationRecipients = [
      ...filteredRecipients,
      ...externalRecipients,
    ];

    const notifications = notificationRecipients.map(recipient =>
      this.buildNotificationTemplate(
        options,
        recipient,
        emailTemplate,
        extra?.eventUser
      )
    );

    this.logger.verbose?.(
      `[${emailTemplate} - '${recipientRole}'] ...building notifications - completed`,
      LogContext.NOTIFICATIONS
    );

    // filter all rejected notifications and log them
    const notificationResults = await Promise.allSettled(notifications);
    const notificationTemplateTypes: NotificationTemplateType[] = [];
    notificationResults.forEach(notification => {
      if (isPromiseFulfilledResult(notification)) {
        const value = notification.value;
        if (value) notificationTemplateTypes.push(value);
      } else {
        this.logger.warn(
          `Filtering rejected notification content: ${notification.reason}`,
          LogContext.NOTIFICATIONS
        );
      }
    });
    return notificationTemplateTypes;
  }

  private async buildNotificationTemplate(
    options: NotificationOptions<TPayload, TEmailPayload>,
    recipient: User | PlatformUser,
    templateName: string,
    eventUser?: User
  ): Promise<NotificationTemplateType | undefined> {
    const { templatePayloadBuilderFn, templateType, payload } = options;
    if (!templatePayloadBuilderFn) {
      throw new TemplateBuilderFnNotProvidedException(
        `No template builder function provided for template '${templateType}'`
      );
    }

    if (!payload) {
      throw new EventPayloadNotProvidedException(
        `Payload not provided for template '${templateName}'`
      );
    }

    const templatePayload = templatePayloadBuilderFn(
      payload,
      recipient,
      eventUser
    );

    return await this.notificationTemplateBuilder.buildTemplate(
      templateName,
      templatePayload
    );
  }
}

const isPromiseFulfilledResult = (
  result: PromiseSettledResult<any>
): result is PromiseFulfilledResult<any> => result.status === 'fulfilled';
