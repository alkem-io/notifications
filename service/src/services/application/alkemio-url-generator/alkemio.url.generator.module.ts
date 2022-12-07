import { Module } from '@nestjs/common';
import { ALKEMIO_URL_GENERATOR } from '@common/enums';
import { AlkemioUrlGenerator } from '.';

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
