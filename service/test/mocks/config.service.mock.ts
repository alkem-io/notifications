import { ValueProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PublicPart } from 'service/test/utils/public-part';

export const MockConfigServiceProvider: ValueProvider<
  PublicPart<ConfigService>
> = {
  provide: ConfigService,
  useValue: {
    get: jest.fn(),
  },
};
