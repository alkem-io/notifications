import { LogContext, NotSupportedException } from '@src/common';
import { TemplateRule } from '@src/core/contracts';
import { CredentialCriterion } from '@src/core/models';

/***
 * Returns a credential from the payload based on the rule provided
 * @param templateRule
 * @param lookupMap
 * @returns Credential if matched with the payload, *undefined* otherwise
 */
export const ruleToCredentialCriterion = (
  templateRule: TemplateRule,
  lookupMap: Map<string, string>
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
 * @returns
 * *string* - a resourceID is matched;
 * *null* - the provided *role* is not supported or the *resourceIdPattern* has no match in the payload
 * *undefined* - a resourceId is matched with the role, but the credential does not require a resourceId
 */
export const getResourceId = (
  resourceIdPattern: string,
  lookupMap: Map<string, string>
): string | undefined => {
  const fillPattern = new RegExp(/^<\w*>$/g);
  if (!resourceIdPattern || resourceIdPattern.length === 0) {
    return undefined;
  }

  if (resourceIdPattern.search(fillPattern) === -1) {
    // nothing to substitute
    return resourceIdPattern;
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
