import type { LoggerService } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import type { NotificationTemplateType } from '@src/types/notification.template.type';

export type EmailRequest = NonNullable<
  NotificationTemplateType['channels']['email']
>;
export type ProviderStrategy = 'fallback' | 'no-fallback' | 'roundrobin';
export type NotificationStatus = {
  status: 'success' | 'error';
  channels?: { email: { id?: string; providerId: string } };
  errors?: { email: string };
};

export class EmailSender {
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
  private nextProvider = 0;

  constructor(
    smtp: SMTPTransport.Options,
    private readonly strategy: ProviderStrategy = 'fallback',
    private readonly logger: LoggerService
  ) {
    if (!['fallback', 'no-fallback', 'roundrobin'].includes(strategy)) {
      throw new Error(`Invalid email provider strategy: ${strategy}`);
    }
    this.transport = createTransport(smtp);
  }

  async send({ email }: { email: EmailRequest }): Promise<NotificationStatus> {
    const providers =
      this.strategy === 'no-fallback'
        ? ['smtp']
        : this.strategy === 'roundrobin' && this.nextProvider++ % 2 === 1
          ? ['logger', 'smtp']
          : ['smtp', 'logger'];
    let failure: NotificationStatus = { status: 'error' };
    for (const provider of providers) {
      const providerId = `email-${provider}-provider`;
      try {
        let id: string;
        if (provider === 'logger') {
          this.logger.log(`[EMAIL] Sent by "${providerId}":`);
          this.logger.log(email);
          id = `id-${Math.round(Math.random() * 1000000000)}`;
        } else {
          const result = await this.transport.sendMail(email);
          id = result.messageId;
        }
        return {
          status: 'success',
          channels: { email: { id, providerId } },
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.warn?.(`${providerId}: ${message}`);
        failure = {
          status: 'error',
          channels: { email: { id: undefined, providerId } },
          errors: { email: message },
        };
      }
    }
    return failure;
  }
}
