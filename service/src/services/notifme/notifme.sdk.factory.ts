import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@common/enums';
import { EmailSender } from './email.sender';

export async function notifmeSdkFactory(
  logger: LoggerService,
  configService: ConfigService
): Promise<EmailSender | undefined> {
  try {
    const email = configService.get(
      ConfigurationTypes.NOTIFICATION_PROVIDERS
    )?.email;
    return new EmailSender(
      {
        host: email?.smtp?.host,
        port: email?.smtp?.port,
        secure: email?.smtp?.secure,
        auth: {
          user: email?.smtp?.auth?.user,
          pass: email?.smtp?.auth?.pass,
        },
        tls: { rejectUnauthorized: email?.smtp?.tls?.rejectUnauthorized },
      },
      email?.multi_provider_strategy,
      logger
    );
  } catch (error) {
    logger.error(
      `Could not create notifme SDK instance: ${error}`,
      LogContext.NOTIFICATIONS
    );
    return undefined;
  }
}
