/**
 * Immutable snapshot of the notification email blacklist fetched from GraphQL
 */
export interface NotificationEmailBlacklistSnapshot {
  /**
   * Set of unique, normalized (lowercased, trimmed) email addresses
   */
  emails: Set<string>;

  /**
   * Timestamp when this snapshot was fetched from GraphQL
   */
  fetchedAt: Date;

  /**
   * Optional platform identifier (for future multi-platform support)
   */
  platformId?: string;

  /**
   * Optional version/ETag identifier (for future use)
   */
  sourceVersion?: string;
}

/**
 * Configuration for GraphQL blacklist synchronization
 */
export interface BlacklistSyncConfig {
  /**
   * Whether GraphQL blacklist sync is enabled
   */
  enabled: boolean;

  /**
   * Interval between successful syncs (in milliseconds)
   */
  intervalMs: number;

  /**
   * Initial backoff delay for retry attempts (in milliseconds)
   */
  initialBackoffMs: number;

  /**
   * Maximum backoff delay for retry attempts (in milliseconds)
   */
  maxBackoffMs: number;
}
