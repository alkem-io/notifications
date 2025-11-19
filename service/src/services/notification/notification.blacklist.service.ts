import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@common/enums';
import { User } from '@src/core/models';

@Injectable()
export class NotificationBlacklistService {
  private blacklistedEmails: Set<string> = new Set();

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    this.loadBlacklist();
  }

  /**
   * Load and parse the blacklist from configuration.
   * Validates email addresses and warns about invalid entries.
   */
  private loadBlacklist(): void {
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
        this.blacklistedEmails.add(email.toLowerCase());
      } else {
        this.logger.warn?.(
          `Invalid email format in blacklist configuration: "${email}". Entry will be ignored.`,
          LogContext.NOTIFICATIONS
        );
      }
    });

    if (this.blacklistedEmails.size > 0) {
      this.logger.verbose?.(
        `Email blacklist loaded with ${this.blacklistedEmails.size} address(es).`,
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
   * Filter recipients to remove blacklisted email addresses.
   * Returns a new array with only allowed recipients.
   *
   * @param recipients - Array of User objects to filter
   * @returns Filtered array of User objects (non-blacklisted only)
   */
  public filterRecipients(recipients: User[]): User[] {
    if (this.blacklistedEmails.size === 0) {
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

      if (this.blacklistedEmails.has(normalizedEmail)) {
        blockedRecipients.push(recipient);
      } else {
        allowedRecipients.push(recipient);
      }
    });

    // Log blocked recipients
    if (blockedRecipients.length > 0) {
      blockedRecipients.forEach(recipient => {
        this.logger.verbose?.(
          JSON.stringify({
            event: 'notification_blacklist_block',
            recipient_email: recipient.email,
            reason: 'blacklisted',
            user_id: recipient.id || 'unknown',
          }),
          LogContext.NOTIFICATIONS
        );
      });

      this.logger.verbose?.(
        `Filtered ${blockedRecipients.length} blacklisted recipient(s) out of ${recipients.length} total recipient(s).`,
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
    if (!email || this.blacklistedEmails.size === 0) {
      return false;
    }
    return this.blacklistedEmails.has(email.toLowerCase());
  }

  /**
   * Get the current size of the blacklist.
   * Useful for testing and monitoring.
   */
  public getBlacklistSize(): number {
    return this.blacklistedEmails.size;
  }
}
