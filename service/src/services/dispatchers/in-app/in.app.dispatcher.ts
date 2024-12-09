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
import { LogContext } from '@common/enums';

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
      this.logger.error(
        `${InAppDispatcher.name} not initialized`,
        undefined,
        LogContext.IN_APP_DISPATCHER
      );
      return;
    }
    // don't block the constructor
    this.client
      .connect()
      .then(() => {
        this.logger.verbose?.(
          'Client proxy successfully connected to RabbitMQ',
          LogContext.IN_APP_DISPATCHER
        );
      })
      .catch((error: RMQConnectionError | undefined) =>
        this.logger.error(
          error?.err,
          error?.err.stack,
          LogContext.IN_APP_DISPATCHER
        )
      );
  }

  dispatch(
    data: CompressedInAppNotificationPayload<InAppNotificationPayload>[]
  ): void {
    if (data.length === 0) {
      this.logger.verbose?.(
        'Zero in-app compressed notification payload were given for dispatch',
        LogContext.IN_APP_DISPATCHER
      );
      return;
    }

    if (this.logger.verbose) {
      const receiversCount = data.reduce(
        (acc, value) => acc + value.receiverIDs.length,
        0
      );
      this.logger.verbose(
        `Dispatching ${data.length} in-app compressed notification payloads for a total of ${receiversCount} receivers`,
        LogContext.IN_APP_DISPATCHER
      );
    }

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
