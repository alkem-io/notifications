import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { inAppClientProxyFactory } from './in.app.client.proxy.factory';
import { ClientProxy } from '@nestjs/microservices';
import { RMQConnectionError } from '@src/types';
import { CompressedInAppNotificationPayload } from '@alkemio/notifications-lib';

@Injectable()
export class InAppNotificationSender {
  private readonly client: ClientProxy | undefined;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
    private readonly configService: ConfigService
  ) {
    const rabbitMqOptions = this.configService.get('rabbitmq.connection');
    const queue = this.configService.get('notification_providers.in_app.queue');

    this.client = inAppClientProxyFactory(
      {
        ...rabbitMqOptions,
        queue,
      },
      this.logger
    );

    if (!this.client) {
      this.logger.error(`${InAppNotificationSender.name} not initialized`);
      return;
    }
    // don't block the constructor
    this.client
      .connect()
      .then(() => {
        this.logger.verbose?.(
          'Client proxy successfully connected to RabbitMQ'
        );
      })
      .catch((error: RMQConnectionError | undefined) =>
        this.logger.error(error?.err, error?.err.stack)
      );
  }

  public send(data: CompressedInAppNotificationPayload[]) {
    try {
      return this.sendWithoutResponse(data);
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * Sends a message to the queue without waiting for a response.
   * Each consumer needs to manually handle failures, returning the proper type.
   * @param data
   */
  private sendWithoutResponse = <TInput>(data: TInput): void | never => {
    const pattern = 'in-app-notification-receive';
    if (!this.client) {
      throw new Error('Connection was not established. Sending failed.');
    }

    this.logger.debug?.({
      method: 'sendWithoutResponse',
      pattern,
      data,
    });

    this.client.emit<void, TInput>(pattern, data);
  };
}
