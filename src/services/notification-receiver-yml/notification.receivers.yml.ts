import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  INotificationRecipientProvider,
  INotificationRecipientTemplateProvider,
  RecipientCredential,
  TemplateRule,
} from '@core/contracts';
import { NotificationRecipientsYmlTemplate } from '@src/services/notification-receivers-template-yml/notification.receivers.template.yml';
import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types';

// todo tests
@Injectable()
export class NotificationReceiversYml
  implements INotificationRecipientProvider
{
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(NotificationRecipientsYmlTemplate)
    private readonly recipientTemplateProvider: INotificationRecipientTemplateProvider
  ) {}

  public getApplicationCreatedRecipients(
    payload: ApplicationCreatedEventPayload
  ): RecipientCredential[] {
    const template = this.recipientTemplateProvider.getTemplate();

    if (!template.application_created) {
      return [];
    }

    const { admin = [], applicant = [] } = template.application_created;

    const admins = admin.map(x => ruleToCredential(x, payload, true));
    const applicants = applicant.map(x => ruleToCredential(x, payload));

    // and filter out the mismatches
    return [...admins, ...applicants].filter(x => x) as RecipientCredential[];
  }
}

/***
 * Returns a credential from the payload based on the rule provided
 * @param templateRule
 * @param payload
 * @param isAdmin
 * @returns Credential if matched with the payload, *undefined* otherwise
 */
const ruleToCredential = (
  templateRule: TemplateRule,
  payload: ApplicationCreatedEventPayload,
  isAdmin = false
): RecipientCredential | undefined => {
  const { rule } = templateRule;
  const resourceID = getResourceId(rule.type, rule.resource_id, payload);

  if (resourceID === null) {
    return undefined;
  }

  return {
    role: templateRule.rule.type,
    resourceID,
    isAdmin,
  };
};

/***
 * Matches a resourceID pattern in the template with the one in the payload
 * and it's corresponding role type
 * @param role
 * @param resourceIdPattern
 * @param payload
 * @returns
 * *string* - a resourceID is matched;
 * *null* - the provided *role* is not supported or the *resourceIdPattern* has no match in the payload
 * *undefined* - a resourceId is matched with the role, but the credential does not require a resourceId
 */
const getResourceId = (
  role: AuthorizationCredential,
  resourceIdPattern: string,
  payload: ApplicationCreatedEventPayload
): string | undefined | null => {
  const fillPattern = new RegExp(/^<\w*>$/g);
  const resourceIdFromPayload = getResourceIdByRole(role, payload);

  if (!resourceIdFromPayload || resourceIdPattern.search(fillPattern) > -1) {
    // return resourceId from the payload or undefined | null
    return resourceIdFromPayload;
  }

  // return matched resourceId from the pattern with the payload
  return resourceIdPattern === resourceIdFromPayload
    ? resourceIdFromPayload
    : null;
};

/***
 * Matches a resourceID in the payload with it's corresponding role type
 * @param role
 * @param payload
 * @returns
 * *string* - a resourceId is matched
 * *undefined* - a resourceId is matched with the role, but the credential does not require a resourceId
 * *null* - the role is not supported
 */
const getResourceIdByRole = (
  role: AuthorizationCredential,
  payload: ApplicationCreatedEventPayload
): string | undefined | null | never => {
  const hubId = payload?.hub?.id;
  const challengeId = payload?.hub?.challenge?.id ?? null;
  const opportunityId = payload?.hub?.challenge?.opportunity?.id ?? null;
  const applicantId = payload?.applicantID ?? null;

  if (!hubId) {
    throw new Error('"id" field of "hub" not found in the payload');
  }

  switch (role) {
    case AuthorizationCredential.EcoverseAdmin:
      return hubId;
    case AuthorizationCredential.ChallengeAdmin:
      return challengeId;
    case AuthorizationCredential.OpportunityAdmin:
      return opportunityId;
    case AuthorizationCredential.GlobalAdmin:
      return undefined;
    case AuthorizationCredential.UserSelfManagement:
      return applicantId;
    default:
      return null;
  }
};
