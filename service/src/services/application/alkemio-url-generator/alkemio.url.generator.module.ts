import { Module } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { AlkemioUrlGenerator } from './alkemio.url.generator';

@Module({
  imports: [],
  providers: [
    {
      provide: ALKEMIO_URL_GENERATOR,
      useClass: AlkemioUrlGenerator,
    },
  ],
  exports: [ALKEMIO_URL_GENERATOR],
})
export class AlkemioUrlGeneratorModule {}
