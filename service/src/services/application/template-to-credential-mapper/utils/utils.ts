import { LogContext } from '@common/enums';
import { TemplateRule } from '@core/contracts';
import { CredentialCriterion, ROLE_EXTERNAL_USER } from '@core/models';
import { NotSupportedException } from '@src/common/exceptions';

/***
 * Returns a credential from the payload based on the rule provided
 * @param templateRule
 * @param lookupMap
 * @returns Credential if matched with the payload, *undefined* otherwise
 */
export const ruleToCredentialCriterion = (
  templateRule: TemplateRule,
  lookupMap?: Map<string, string>
): CredentialCriterion => {
  const resourceID = getResourceId(
    templateRule.rule.resource_id || '',
    lookupMap
  );

  return {
    type: templateRule.rule.type,
    resourceID: resourceID,
  };
};

/***
 * Matches a resourceID pattern via a value in the provided map
 * @param resourceIdPattern
 * @param lookupMap
 * @returns
 * *string* - a resourceID is matched;
 * *null* - the provided *role* is not supported or the *resourceIdPattern* has no match in the payload
 * *undefined* - a resourceId is matched with the role, but the credential does not require a resourceId
 */
export const getResourceId = (
  resourceIdPattern: string,
  lookupMap?: Map<string, string>
): string | undefined => {
  const fillPattern = new RegExp(/^<\w*>$/g);
  if (!resourceIdPattern || resourceIdPattern.length === 0) {
    return undefined;
  }

  if (resourceIdPattern.search(fillPattern) === -1) {
    // nothing to substitute
    return resourceIdPattern;
  }

  if (!lookupMap) {
    throw new NotSupportedException(
      'lookupMap not provided',
      LogContext.NOTIFICATIONS
    );
  }

  // Need to do a replacement
  const lookupKey = resourceIdPattern.substring(
    1,
    resourceIdPattern.length - 1
  );
  const lookupValue = lookupMap.get(lookupKey);
  if (!lookupValue && lookupValue != '') {
    throw new NotSupportedException(
      `The provided resourceID of '${resourceIdPattern}' gave a lookup key of '${lookupKey}' that was not in the provided map: ${lookupMap.keys()}`,
      LogContext.NOTIFICATIONS
    );
  }

  return lookupValue;
};

/***
 * Filteres credential list from notification service role types
 * @param credentialCriteria
 * @returns Credential creiteria list
 */
export const filterCredentialCriterion = (
  credentialCriteria: CredentialCriterion[]
): CredentialCriterion[] => {
  return credentialCriteria.filter(
    criteria => (criteria.type as string) !== ROLE_EXTERNAL_USER
  );
};

/***
 * Filteres credential list from notification service role types
 * @param credentialCriteria
 * @returns Credential creiteria list
 */
export const isCredentialCriterionExternalUser = (
  credentialCriteria: CredentialCriterion[]
): boolean => {
  const criteria = credentialCriteria.find(
    criteria => (criteria.type as string) === ROLE_EXTERNAL_USER
  );

  if (criteria) return true;

  return false;
};
