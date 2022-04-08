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
  TemplateNotProvidedException,
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

export type RoleConfig = {
  role: string;
  emailTemplate: EmailTemplate;
  preferenceType?: UserPreferenceType;
};
export type TemplateType = keyof TemplateConfig;
export type TemplateBuilderFn<TPayload> = (
  payload: TPayload,
  recipient: User,
  eventUser?: User
) => Record<string, unknown>;

export type NotificationOptions<TPayload> = {
  payload?: TPayload;
  eventUserId?: string;
  roleConfig?: RoleConfig[];
  templateType?: TemplateType;
  templatePayloadBuilderFn?: (
    payload: TPayload,
    recipient: User,
    eventUser: User | undefined
  ) => Record<string, unknown>;
  // todo: can we improve the type
  templateVariables?: Map<string, string>;
};

export class NotificationBuilder<TPayload = Record<string, unknown>> {
  private options: NotificationOptions<TPayload>;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private alkemioAdapter: AlkemioClientAdapter,
    @Inject(TEMPLATE_PROVIDER)
    private readonly notificationTemplateBuilder: NotificationTemplateBuilder,
    @Inject(NOTIFICATION_RECIPIENTS_YML_ADAPTER)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {
    this.options = {};
  }

  setPayload(payload: TPayload) {
    this.options.payload = payload;
    return this;
  }

  setEventUser(id: string) {
    this.options.eventUserId = id;
    return this;
  }

  setRoleConfig(config: RoleConfig | RoleConfig[]) {
    if (!this.options.roleConfig) {
      this.options.roleConfig = [];
    }

    this.options.roleConfig.push(
      ...(Array.isArray(config) ? config : [config])
    );

    return this;
  }

  // todo: can we improve the type of map
  setTemplateVariables(map: Map<string, string>) {
    this.options.templateVariables = map;
    return this;
  }

  setTemplateType(templateType: TemplateType) {
    this.options.templateType = templateType;
    return this;
  }

  setTemplateBuilderFn(fn: TemplateBuilderFn<TPayload>) {
    this.options.templatePayloadBuilderFn = fn;
    return this;
  }

  getOptions() {
    return this.options;
  }

  reset() {
    this.options = {};
    return this;
  }

  async build(): Promise<NotificationTemplateType[]> {
    this.logger.verbose?.(
      JSON.stringify(this.options.payload),
      LogContext.NOTIFICATIONS
    );
    // get the user related to that event
    const eventUser = this.options.eventUserId
      ? await this.alkemioAdapter.getUser(this.options.eventUserId)
      : undefined;

    if (!this.options.roleConfig || !this.options.roleConfig.length) {
      throw new RolesNotProvidedException(
        `No roles are provided for template '${this.options.templateType}'`
      );
    }

    const notificationsForRoles = this.options.roleConfig.flatMap(
      ({ role, emailTemplate, preferenceType }) =>
        this.buildNotificationsForRole(role, emailTemplate, {
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
    recipientRole: string,
    emailTemplate: EmailTemplate,
    extra?: {
      eventUser?: User;
      rolePreferenceType?: UserPreferenceType;
    }
  ): Promise<NotificationTemplateType[]> {
    this.logger.verbose?.(
      `Building notifications with [${emailTemplate}] for '${recipientRole}'`,
      LogContext.NOTIFICATIONS
    );

    if (!this.options.templateType) {
      throw new TemplateNotProvidedException('Template type not provided');
    }

    const ruleSets =
      this.recipientTemplateProvider.getTemplate()?.[this.options.templateType];

    if (this.options.roleConfig && !ruleSets) {
      const rolesText = this.options.roleConfig.map(x => x.role).join(',');
      throw new RuleSetNotFoundException(
        `No rule set(s) found for roles: [${rolesText}]`
      );
    }

    const credentialCriteria =
      this.recipientTemplateProvider.getCredentialCriteria(
        recipientRole,
        this.options.templateVariables,
        ruleSets
      );

    const recipients =
      await this.alkemioAdapter.getUniqueUsersMatchingCredentialCriteria(
        credentialCriteria
      );

    if (!recipients.length) {
      const criteriaText = credentialCriteria
        .map(x => `<${x.type},${x.resourceID}`)
        .join(' OR ');
      this.logger.verbose?.(
        `Unable to find recipients matching ${criteriaText}`,
        LogContext.NOTIFICATIONS
      );
      return [];
    }

    const filteredRecipients: User[] = [];

    if (!extra?.rolePreferenceType) {
      filteredRecipients.push(...recipients);
    } else {
      for (const recipient of recipients) {
        if (
          recipient.preferences &&
          recipient.preferences.find(
            preference =>
              preference.definition.type === extra?.rolePreferenceType &&
              preference.value === 'true'
          )
        ) {
          filteredRecipients.push(recipient);
        }
      }
    }

    this.logger.verbose?.(
      `Notifications with [${emailTemplate}] for role ${recipientRole} - identified ${filteredRecipients.length} recipients`,
      LogContext.NOTIFICATIONS
    );

    const notifications = filteredRecipients.map(recipient =>
      this.buildNotificationTemplate(recipient, emailTemplate, extra?.eventUser)
    );

    this.logger.verbose?.(
      `Building notifications for [${emailTemplate}] - completed`,
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
    recipient: User,
    templateName: string,
    eventUser?: User
  ): Promise<NotificationTemplateType | undefined> {
    if (!this.options.templatePayloadBuilderFn) {
      throw new TemplateBuilderFnNotProvidedException(
        `No template builder function provided for template '${this.options.templateType}'`
      );
    }

    if (!this.options.payload) {
      throw new EventPayloadNotProvidedException(
        `Payload not provided for template '${templateName}'`
      );
    }

    const templatePayload = this.options.templatePayloadBuilderFn(
      this.options.payload,
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
