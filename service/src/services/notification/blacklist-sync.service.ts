import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { GraphQLClient } from 'graphql-request';
import { ConfigurationTypes, LogContext } from '@common/enums';
import {
  NotificationEmailBlacklistSnapshot,
  BlacklistSyncConfig,
} from '@src/types/blacklist.types';

/**
 * Service responsible for fetching and maintaining the notification email blacklist
 * from the Alkemio GraphQL API. Implements periodic sync with exponential backoff
 * on failures.
 */
@Injectable()
export class BlacklistSyncService implements OnModuleInit {
  private graphqlClient: GraphQLClient | null = null;
  private currentSnapshot: NotificationEmailBlacklistSnapshot | null = null;
  private lastErrorAt: Date | null = null;
  private consecutiveFailures = 0;
  private syncIntervalHandle: NodeJS.Timeout | null = null;
  private config: BlacklistSyncConfig;

  // GraphQL query for fetching the blacklist
  private readonly BLACKLIST_QUERY = `
    query BlacklistLookup {
      platform {
        id
        settings {
          integration {
            notificationEmailBlacklist
          }
        }
      }
    }
  `;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    // Load configuration
    const alkemioConfig = this.configService.get(ConfigurationTypes.ALKEMIO);
    const blacklistSyncConfig = alkemioConfig?.blacklist_sync || {};

    this.config = {
      enabled: blacklistSyncConfig.enabled ?? true,
      intervalMs: blacklistSyncConfig.interval_ms ?? 300000, // 5 minutes default
      initialBackoffMs: blacklistSyncConfig.initial_backoff_ms ?? 250,
      maxBackoffMs: blacklistSyncConfig.max_backoff_ms ?? 30000, // 30 seconds max
    };

    // Initialize GraphQL client if sync is enabled
    if (this.config.enabled) {
      const endpoint = alkemioConfig?.endpoint;
      if (!endpoint) {
        this.logger.error?.(
          'GraphQL blacklist sync is enabled but ALKEMIO_SERVER_ENDPOINT is not configured. Sync will be disabled.',
          LogContext.NOTIFICATIONS
        );
        this.config.enabled = false;
      } else {
        this.graphqlClient = new GraphQLClient(endpoint, {
          headers: {},
        });

        this.logger.log?.(
          `GraphQL blacklist sync initialized with interval: ${this.config.intervalMs}ms`,
          LogContext.NOTIFICATIONS
        );
      }
    } else {
      this.logger.log?.(
        'GraphQL blacklist sync is disabled. Using static configuration only.',
        LogContext.NOTIFICATIONS
      );
    }
  }

  /**
   * Lifecycle hook: Start the sync process when module initializes
   */
  async onModuleInit(): Promise<void> {
    if (!this.config.enabled || !this.graphqlClient) {
      return;
    }

    // Perform initial sync on startup
    await this.performSync();

    // Start periodic sync
    this.startPeriodicSync();
  }

  /**
   * Start the periodic sync interval
   */
  private startPeriodicSync(): void {
    if (this.syncIntervalHandle) {
      clearInterval(this.syncIntervalHandle);
    }

    this.syncIntervalHandle = setInterval(
      () => this.performSync(),
      this.config.intervalMs
    );

    this.logger.verbose?.(
      `Periodic blacklist sync started with interval: ${this.config.intervalMs}ms`,
      LogContext.NOTIFICATIONS
    );
  }

  /**
   * Perform a sync operation: fetch from GraphQL, normalize, and update snapshot
   */
  private async performSync(): Promise<void> {
    if (!this.graphqlClient) {
      return;
    }

    try {
      this.logger.verbose?.(
        'Starting blacklist sync from GraphQL...',
        LogContext.NOTIFICATIONS
      );

      // Execute GraphQL query
      const response = await this.graphqlClient.request<{
        platform: {
          id: string;
          settings: {
            integration: {
              notificationEmailBlacklist: string[];
            };
          };
        };
      }>(this.BLACKLIST_QUERY);

      // Extract blacklist array
      const rawBlacklist =
        response?.platform?.settings?.integration?.notificationEmailBlacklist ||
        [];

      // Normalize and validate entries
      const normalizedEmails = this.normalizeAndValidate(rawBlacklist);

      // Create new snapshot
      const newSnapshot: NotificationEmailBlacklistSnapshot = {
        emails: new Set(normalizedEmails),
        fetchedAt: new Date(),
        platformId: response?.platform?.id,
      };

      // Update current snapshot atomically
      this.currentSnapshot = newSnapshot;

      // Reset failure tracking on success
      this.consecutiveFailures = 0;
      this.lastErrorAt = null;

      // Log success
      // TODO: Add metric - notifications_blacklist_snapshot_age_seconds
      // TODO: Add metric - notifications_blacklist_size (gauge)
      this.logger.log?.(
        JSON.stringify({
          event: 'blacklist_sync_success',
          snapshot_size: newSnapshot.emails.size,
          fetched_at: newSnapshot.fetchedAt.toISOString(),
          platform_id: newSnapshot.platformId,
        }),
        LogContext.NOTIFICATIONS
      );

      this.logger.verbose?.(
        `Blacklist sync completed successfully. ${newSnapshot.emails.size} email(s) in blacklist.`,
        LogContext.NOTIFICATIONS
      );
    } catch (error) {
      this.handleSyncFailure(error);
    }
  }

  /**
   * Handle sync failure with exponential backoff
   */
  private handleSyncFailure(error: any): void {
    this.consecutiveFailures++;
    this.lastErrorAt = new Date();

    const isAuthError = error?.response?.status === 401;
    const errorType = isAuthError ? 'authentication_error' : 'sync_error';

    // TODO: Add metric - notifications_blacklist_sync_failures_total (counter)
    // TODO: Add metric - notifications_blacklist_snapshot_age_seconds (gauge)
    this.logger.error?.(
      JSON.stringify({
        event: 'blacklist_sync_failure',
        error_type: errorType,
        consecutive_failures: this.consecutiveFailures,
        error_message: error?.message || 'Unknown error',
        last_snapshot_age_seconds: this.currentSnapshot
          ? Math.floor(
              (Date.now() - this.currentSnapshot.fetchedAt.getTime()) / 1000
            )
          : null,
      }),
      LogContext.NOTIFICATIONS
    );

    // Calculate backoff delay using exponential backoff
    const backoffDelay = Math.min(
      this.config.initialBackoffMs * Math.pow(2, this.consecutiveFailures - 1),
      this.config.maxBackoffMs
    );

    this.logger.warn?.(
      `Blacklist sync failed (attempt ${this.consecutiveFailures}). ` +
        `${isAuthError ? 'Authentication error detected. ' : ''}` +
        `Retrying in ${backoffDelay}ms. ` +
        `${this.currentSnapshot ? 'Using last successful snapshot.' : 'No previous snapshot available.'}`,
      LogContext.NOTIFICATIONS
    );

    // Schedule retry with backoff
    if (this.consecutiveFailures === 1) {
      // Only schedule immediate retry on first failure, then rely on periodic sync
      setTimeout(() => this.performSync(), backoffDelay);
    }
  }

  /**
   * Normalize and validate email addresses from raw GraphQL response
   */
  private normalizeAndValidate(rawEmails: string[]): string[] {
    const normalized: string[] = [];
    const seen = new Set<string>();
    const maxEntries = 250; // Platform limit

    for (const rawEmail of rawEmails) {
      if (typeof rawEmail !== 'string') {
        this.logger.warn?.(
          `Invalid blacklist entry (not a string): ${JSON.stringify(rawEmail)}. Skipping.`,
          LogContext.NOTIFICATIONS
        );
        continue;
      }

      // Normalize: trim and lowercase
      const email = rawEmail.trim().toLowerCase();

      // Skip empty strings
      if (email.length === 0) {
        continue;
      }

      // Skip duplicates
      if (seen.has(email)) {
        continue;
      }

      // Validate email format (simple validation: has @ and . after @)
      if (!this.isValidEmail(email)) {
        this.logger.warn?.(
          `Invalid email format in GraphQL blacklist: "${rawEmail}". Skipping.`,
          LogContext.NOTIFICATIONS
        );
        continue;
      }

      seen.add(email);
      normalized.push(email);

      // Enforce limit
      if (normalized.length >= maxEntries) {
        this.logger.warn?.(
          `GraphQL blacklist exceeds limit of ${maxEntries} entries. ` +
            `Only the first ${maxEntries} valid entries will be used.`,
          LogContext.NOTIFICATIONS
        );
        break;
      }
    }

    if (normalized.length === 0 && rawEmails.length > 0) {
      this.logger.warn?.(
        `GraphQL returned ${rawEmails.length} blacklist entries, but none were valid after normalization.`,
        LogContext.NOTIFICATIONS
      );
    }

    return normalized;
  }

  /**
   * Basic email validation: must contain @ and have a . after the @
   */
  private isValidEmail(email: string): boolean {
    const atIndex = email.indexOf('@');
    if (atIndex === -1 || atIndex === 0) {
      return false;
    }

    const domainPart = email.substring(atIndex + 1);
    return domainPart.includes('.') && domainPart.length > 2;
  }

  /**
   * Get the current blacklist snapshot (thread-safe read)
   * Returns null if no snapshot is available yet
   */
  public getCurrentSnapshot(): NotificationEmailBlacklistSnapshot | null {
    return this.currentSnapshot;
  }

  /**
   * Check if GraphQL sync is enabled
   */
  public isSyncEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Get the number of consecutive failures
   */
  public getConsecutiveFailures(): number {
    return this.consecutiveFailures;
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.syncIntervalHandle) {
      clearInterval(this.syncIntervalHandle);
      this.syncIntervalHandle = null;
    }
  }
}
