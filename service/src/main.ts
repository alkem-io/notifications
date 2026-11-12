import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AmqpConsumerState } from './amqp.consumer.state';
import { AppModule } from './app.module';
import { ConfigurationTypes } from './common/enums';
import './config/aliases';
import { INestApplication } from '@nestjs/common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const configService: ConfigService = app.get(ConfigService);
  app.useLogger(logger);
  const connectionOptions = configService.get(
    ConfigurationTypes.RABBIT_MQ
  )?.connection;
  const port = configService.get(ConfigurationTypes.HOSTING)?.port;
  await app.listen(port, () => {
    logger.verbose(`Server is listening on port ${port}`);
  });

  const heartbeat = process.env.NODE_ENV === 'production' ? 30 : 120;
  const amqpEndpoint = `amqp://${connectionOptions.user}:${connectionOptions.password}@${connectionOptions.host}:${connectionOptions.port}?heartbeat=${heartbeat}`;

  const amqpConsumerState = app.get(AmqpConsumerState);
  try {
    const microservice = connectMicroservice(
      app,
      amqpEndpoint,
      'alkemio-notifications'
    );
    microservice.status.subscribe(status =>
      amqpConsumerState.setConnected(status === 'connected')
    );
    await app.startAllMicroservices();
    amqpConsumerState.markConsuming();
  } catch (e: any) {
    logger.error(`Failed to start microservices: ${e.message}`);
    process.exit(1);
  }
};

const connectMicroservice = (
  app: INestApplication,
  amqpEndpoint: string,
  queue: string
) => {
  return app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpEndpoint],
      queue,
      queueOptions: { durable: true },
      socketOptions: {
        reconnectTimeInSeconds: 5,
        heartbeatIntervalInSeconds: 30,
      },
      // Bounds the unacked messages held by this pod. Nest's default (0) means
      // unlimited: one pod pulled an entire backlog into memory, starved the
      // event loop and failed its liveness probe on every restart
      // (infrastructure-operations#2634, notifications#581).
      prefetchCount: 10,
      //be careful with this flag, if set to true, message acknowledgment will be automatic. Double acknowledgment throws an error and disconnects the queue.
      noAck: false,
    },
  });
};

bootstrap();
