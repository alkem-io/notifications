/**
 * Normalizes the callout framing type.
 * If the type is null, undefined, or 'none', returns 'Post' as the default.
 * Otherwise returns the original type.
 *
 * @param framingType - The callout framing type to normalize
 * @returns The normalized callout type
 */
export const normalizeCalloutType = (
  framingType: string | null | undefined
): string => {
  return !framingType || framingType.toLowerCase() === 'none'
    ? 'Post'
    : framingType;
};
