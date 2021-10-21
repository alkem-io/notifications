import { Module } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER } from '@src/common';
import { AlkemioClientModule } from '../alkemio-client/alkemio.client.module';
import { AlkemioAdapter } from './alkemio.adapter';

@Module({
  imports: [AlkemioClientModule],
  providers: [
    {
      provide: ALKEMIO_CLIENT_ADAPTER,
      useClass: AlkemioAdapter,
    },
  ],
  exports: [ALKEMIO_CLIENT_ADAPTER],
})
export class AlkemioAdapterModule {}
