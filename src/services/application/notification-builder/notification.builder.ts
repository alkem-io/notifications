import { Inject, LoggerService } from '@nestjs/common';
import {
  ALKEMIO_CLIENT_ADAPTER,
  EventPayloadNotProvidedException,
  LogContext,
  NOTIFICATION_RECIPIENTS_YML_ADAPTER,
  RolesNotProvidedException,
  RuleSetNotFoundException,
  TEMPLATE_PROVIDER,
  TemplateBuilderFnNotProvidedException,
} from '@src/common';
import { AlkemioClientAdapter } from '@src/services';
import { EmailTemplate } from '@common/enums/email.template';
import { UserPreferenceType } from '@alkemio/client-lib';
import { User } from '@core/models';
import {
  INotificationRecipientTemplateProvider,
  TemplateConfig,
} from '@core/contracts/notification.recipient.template.provider.interface';
import { NotificationTemplateBuilder } from '@src/services/external';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { NotificationTemplateType } from '@src/types/notification.template.type';
import { BaseEmailPayload } from '@common/email-template-payload';
import { BaseEventPayload } from '@common/dto';

export type RoleConfig = {
  role: string;
  emailTemplate: EmailTemplate;
  preferenceType?: UserPreferenceType;
};
export type TemplateType = keyof TemplateConfig;
export type TemplateBuilderFn<TPayload, TEmailPayload> = (
  payload: TPayload,
  recipient: User,
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

    const notificationsForRoles = roleConfig.flatMap(
      ({ role, emailTemplate, preferenceType }) =>
        this.buildNotificationsForRole(options, role, emailTemplate, {
          eventUser,
          rolePreferenceType: preferenceType,
        })
    );

    // when the build process of all notification is finished
    // flatten the notification by role a single array of notifications
    // filter the rejected once and log them
    return Promise.allSettled(notificationsForRoles)
      .then(x =>
        x
          .flatMap(y => {
            if (isPromiseFulfilledResult(y)) {
              return y.value;
            } else {
              this.logger.warn(
                `Filtering rejected notification content: ${y.reason}`
              );
              return undefined;
            }
          })
          .filter(x => x)
      )
      .then(x => x as NotificationTemplateType[]);
  }

  private async buildNotificationsForRole(
    options: NotificationOptions<TPayload, TEmailPayload>,
    recipientRole: string,
    emailTemplate: EmailTemplate,
    extra?: {
      eventUser?: User;
      rolePreferenceType?: UserPreferenceType;
    }
  ): Promise<NotificationTemplateType[]> {
    const { templateType, roleConfig, templateVariables } = options;
    this.logger.verbose?.(
      `[${emailTemplate} - '${recipientRole}'] Building notifications - start'`,
      LogContext.NOTIFICATIONS
    );

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

    const recipients =
      await this.alkemioAdapter.getUniqueUsersMatchingCredentialCriteria(
        credentialCriteria
      );

    if (!recipients.length) {
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

    if (!extra?.rolePreferenceType) {
      filteredRecipients.push(...recipients);
    } else {
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
            `[${emailTemplate} - '${recipientRole}'] User ${recipient.displayName} filtered out because of ${extra?.rolePreferenceType}`,
            LogContext.NOTIFICATIONS
          );
          continue;
        }

        filteredRecipients.push(recipient);
      }
    }

    this.logger.verbose?.(
      `[${emailTemplate} - '${recipientRole}'] ...${
        filteredRecipients.length
      } recipients with valid credentials have preference enabled:  ${JSON.stringify(
        filteredRecipients.map(user => user.email)
      )}`,
      LogContext.NOTIFICATIONS
    );

    const notifications = filteredRecipients.map(recipient =>
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
    return Promise.allSettled(notifications)
      .then(x =>
        x
          .map(y => {
            if (isPromiseFulfilledResult(y)) {
              return y.value;
            } else {
              this.logger.warn(`Filtering rejected notifications: ${y.reason}`);
              return undefined;
            }
          })
          .filter(x => x)
      )
      .then(x => x as NotificationTemplateType[]);
  }

  private async buildNotificationTemplate(
    options: NotificationOptions<TPayload, TEmailPayload>,
    recipient: User,
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
