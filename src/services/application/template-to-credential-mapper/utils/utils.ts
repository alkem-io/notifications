import { RecipientCredential, TemplateRule } from '@core/contracts';
import { AuthorizationCredential } from '@alkemio/client-lib';
import { ApplicationCreatedEventPayload } from '@src/types/application.created.event.payload';

/***
 * Returns a credential from the payload based on the rule provided
 * @param templateRule
 * @param payload
 * @param isAdmin
 * @returns Credential if matched with the payload, *undefined* otherwise
 */
export const ruleToCredential = (
  templateRule: TemplateRule,
  payload: ApplicationCreatedEventPayload
): RecipientCredential => {
  const { rule } = templateRule;
  const resourceID = getResourceId(rule.type, rule.resource_id || '', payload);

  //valentin - what if it's undefined and not null?
  if (resourceID === null) {
    rule.resource_id = undefined;
  }

  return rule;
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
export const getResourceId = (
  role: AuthorizationCredential,
  resourceIdPattern: string,
  payload: ApplicationCreatedEventPayload
): string | undefined | null => {
  const fillPattern = new RegExp(/^<\w*>$/g);
  const resourceIdFromPayload = getResourceIdByRole(role, payload);

  if (!resourceIdFromPayload) {
    // return undefined | null
    return resourceIdFromPayload;
  }

  if (resourceIdPattern.search(fillPattern) > -1) {
    // return resourceId from the payload
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
export const getResourceIdByRole = (
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
