import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { WinstonConfigService } from './config';
import configuration from './config/configuration';
import { HttpExceptionsFilter } from './core';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'ALKEMIO_NOTIFICATIONS_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://user:bitnami@localhost:5672?heartbeat=30'],
    //       queue: 'alkemio-notifications',
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      load: [configuration],
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionsFilter,
    },
    NotificationService,
  ],
  controllers: [AppController],
})
export class AppModule {}
