import {
  CompressedInAppNotificationPayload,
  InAppNotificationPayload,
} from '@alkemio/notifications-lib';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { RMQConnectionError } from '@src/types';
import { Dispatcher } from '../dispatcher';
import { inAppClientProxyFactory } from './in.app.client.proxy.factory';

@Injectable()
export class InAppDispatcher implements Dispatcher {
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
      this.logger.error(`${InAppDispatcher.name} not initialized`);
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

  dispatch(
    data: CompressedInAppNotificationPayload<InAppNotificationPayload>[]
  ): void {
    this.logger.verbose?.(
      `Dispatching ${data.length} in-app compressed notification payloads`
    );
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
    const pattern = 'in-app-notification-incoming';
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
