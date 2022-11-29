import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ALKEMIO_CLIENT_PROVIDER } from '@common/enums';
import { alkemioClientFactory } from './alkemio.client.factory';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ALKEMIO_CLIENT_PROVIDER,
      useFactory: alkemioClientFactory,
      inject: [WINSTON_MODULE_NEST_PROVIDER, ConfigService],
    },
  ],
  exports: [ALKEMIO_CLIENT_PROVIDER],
})
export class AlkemioClientModule {}
