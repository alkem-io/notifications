import { ClassProvider, Module } from '@nestjs/common';
import { ALKEMIO_CLIENT_ADAPTER } from '@common/enums';
import { AlkemioClientModule } from '../../external/alkemio-client/alkemio.client.module';
import { AlkemioClientAdapter } from './alkemio.client.adapter';

export const AlkemioClientAdapterProvider: ClassProvider = {
  provide: ALKEMIO_CLIENT_ADAPTER,
  useClass: AlkemioClientAdapter,
};

@Module({
  imports: [AlkemioClientModule],
  providers: [AlkemioClientAdapterProvider],
  exports: [ALKEMIO_CLIENT_ADAPTER],
})
export class AlkemioClientAdapterModule {}
