import {
  ClientProxy,
  ClientProxyFactory,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { LoggerService } from '@nestjs/common';

export const inAppClientProxyFactory = (
  config: {
    user: string;
    password: string;
    host: string;
    port: number;
    heartbeat: number;
    queue: string;
  },
  logger: LoggerService
): ClientProxy | undefined => {
  const { host, port, user, password, heartbeat: _heartbeat, queue } = config;
  const heartbeat =
    process.env.NODE_ENV === 'production' ? _heartbeat : _heartbeat * 3;
  logger.verbose?.({ ...config, heartbeat, password: undefined });
  try {
    const options: RmqOptions = {
      transport: Transport.RMQ,
      options: {
        urls: [
          {
            protocol: 'amqp',
            hostname: host,
            username: user,
            password,
            port,
            heartbeat,
          },
        ],
        queue,
        queueOptions: { durable: true },
        noAck: true,
      },
    };
    return ClientProxyFactory.create(options);
  } catch (err) {
    logger.error(`Could not connect to RabbitMQ: ${err}`);
    return undefined;
  }
};
