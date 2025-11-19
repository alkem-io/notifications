import { Inject, Injectable, LoggerService, Optional } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@common/enums';
import { User } from '@src/core/models';
import { BlacklistSyncService } from './blacklist-sync.service';

@Injectable()
export class NotificationBlacklistService {
  private staticBlacklistedEmails: Set<string> = new Set();

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    @Optional() private readonly blacklistSyncService?: BlacklistSyncService
  ) {
    this.loadStaticBlacklist();
  }

  /**
   * Load and parse the static blacklist from configuration.
   * Validates email addresses and warns about invalid entries.
   */
  private loadStaticBlacklist(): void {
    const emailConfig = this.configService.get(
      ConfigurationTypes.NOTIFICATION_PROVIDERS
    )?.email;

    const normalizedEntries = this.normalizeBlacklistEntries(
      emailConfig?.blacklist
    );

    if (normalizedEntries.length === 0) {
      this.logger.verbose?.(
        'Email blacklist is empty or not configured. All recipients will be allowed.',
        LogContext.NOTIFICATIONS
      );
      return;
    }

    // Parse comma-separated list
    const entries = normalizedEntries
      .map((email: string) => email.trim())
      .filter((email: string) => email.length > 0);

    // Validate and add to set (deduplicates automatically)
    entries.forEach((email: string) => {
      if (this.isValidEmail(email)) {
        this.staticBlacklistedEmails.add(email.toLowerCase());
      } else {
        this.logger.warn?.(
          `Invalid email format in blacklist configuration: "${email}". Entry will be ignored.`,
          LogContext.NOTIFICATIONS
        );
      }
    });

    if (this.staticBlacklistedEmails.size > 0) {
      this.logger.verbose?.(
        `Static email blacklist loaded with ${this.staticBlacklistedEmails.size} address(es).`,
        LogContext.NOTIFICATIONS
      );
    }
  }

  /**
   * Normalize blacklist configuration values into a flat list of strings.
   * Supports comma-separated strings or arrays of strings.
   */
  private normalizeBlacklistEntries(rawValue: unknown): string[] {
    if (rawValue == null) {
      return [];
    }

    if (typeof rawValue === 'string') {
      return rawValue.split(',');
    }

    if (Array.isArray(rawValue)) {
      return rawValue
        .filter((entry): entry is string => typeof entry === 'string')
        .flatMap((entry: string) => entry.split(','));
    }

    this.logger.warn?.(
      `Unsupported type for email blacklist configuration: ${typeof rawValue}. Expected string or string[].`,
      LogContext.NOTIFICATIONS
    );

    return [];
  }

  /**
   * Basic email validation using a simple regex.
   * This matches the standard email pattern with @ and domain.
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get the effective blacklist (GraphQL if available and enabled, otherwise static)
   */
  private getEffectiveBlacklist(): Set<string> {
    // If GraphQL sync is enabled and has a snapshot, use it
    if (this.blacklistSyncService?.isSyncEnabled()) {
      const snapshot = this.blacklistSyncService.getCurrentSnapshot();
      if (snapshot) {
        return snapshot.emails;
      }
      // If GraphQL sync is enabled but no snapshot yet, use empty set (fail-open)
      return new Set<string>();
    }

    // Fall back to static blacklist
    return this.staticBlacklistedEmails;
  }

  /**
   * Filter recipients to remove blacklisted email addresses.
   * Returns a new array with only allowed recipients.
   * Uses GraphQL blacklist if available, otherwise falls back to static configuration.
   *
   * @param recipients - Array of User objects to filter
   * @returns Filtered array of User objects (non-blacklisted only)
   */
  public filterRecipients(recipients: User[]): User[] {
    const blacklist = this.getEffectiveBlacklist();

    if (blacklist.size === 0) {
      // No blacklist configured, return all recipients
      return recipients;
    }

    const allowedRecipients: User[] = [];
    const blockedRecipients: User[] = [];

    recipients.forEach(recipient => {
      if (!recipient.email) {
        // If recipient has no email, we can't filter it, so include it
        allowedRecipients.push(recipient);
        return;
      }

      const normalizedEmail = recipient.email.toLowerCase();

      if (blacklist.has(normalizedEmail)) {
        blockedRecipients.push(recipient);
      } else {
        allowedRecipients.push(recipient);
      }
    });

    // Log blocked recipients
    if (blockedRecipients.length > 0) {
      const snapshot = this.blacklistSyncService?.getCurrentSnapshot();
      const blacklistSource = this.blacklistSyncService?.isSyncEnabled()
        ? 'graphql'
        : 'static';

      blockedRecipients.forEach(recipient => {
        this.logger.verbose?.(
          JSON.stringify({
            event: 'notification_blacklist_block',
            recipient_email: recipient.email,
            reason: 'blacklisted',
            user_id: recipient.id || 'unknown',
            blacklist_source: blacklistSource,
            snapshot_fetched_at: snapshot?.fetchedAt.toISOString(),
          }),
          LogContext.NOTIFICATIONS
        );
      });

      this.logger.verbose?.(
        `Filtered ${blockedRecipients.length} blacklisted recipient(s) out of ${recipients.length} total recipient(s). Source: ${blacklistSource}`,
        LogContext.NOTIFICATIONS
      );
    }

    return allowedRecipients;
  }

  /**
   * Check if a specific email address is blacklisted.
   *
   * @param email - Email address to check
   * @returns true if the email is blacklisted, false otherwise
   */
  public isBlacklisted(email: string): boolean {
    if (!email) {
      return false;
    }

    const blacklist = this.getEffectiveBlacklist();
    if (blacklist.size === 0) {
      return false;
    }

    return blacklist.has(email.toLowerCase());
  }

  /**
   * Get the current size of the effective blacklist.
   * Useful for testing and monitoring.
   */
  public getBlacklistSize(): number {
    return this.getEffectiveBlacklist().size;
  }

  /**
   * Get the source of the current blacklist
   */
  public getBlacklistSource(): 'graphql' | 'static' {
    if (
      this.blacklistSyncService?.isSyncEnabled() &&
      this.blacklistSyncService?.getCurrentSnapshot()
    ) {
      return 'graphql';
    }
    return 'static';
  }
}
