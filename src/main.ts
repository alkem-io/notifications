import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import './config/aliases';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:bitnami@localhost:5672?heartbeat=30'],
      queue: 'alkemio-notifications',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.startAllMicroservices();
};

bootstrap();
