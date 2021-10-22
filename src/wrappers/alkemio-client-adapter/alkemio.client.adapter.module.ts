import { Module } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER } from '@src/common';
import { AlkemioClientModule } from '../alkemio-client/alkemio.client.module';
import { AlkemioClientAdapter } from './alkemio.client.adapter';

@Module({
  imports: [AlkemioClientModule],
  providers: [
    {
      provide: ALKEMIO_CLIENT_ADAPTER,
      useClass: AlkemioClientAdapter,
    },
  ],
  exports: [ALKEMIO_CLIENT_ADAPTER],
})
export class AlkemioClientAdapterModule {}
