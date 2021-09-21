import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import './config/aliases';
import { useContainer } from 'class-validator';
import { HttpExceptionsFilter } from './core';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionsFilter(logger));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  await app.listen(4001);
};

bootstrap();
