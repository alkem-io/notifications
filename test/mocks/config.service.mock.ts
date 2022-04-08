import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PublicPart } from '@test/utils/public-part';

class MockConfigService implements PublicPart<ConfigService> {
  get() {
    throw new Error('Not implemented');
  }
}

export const MockConfigServiceProvider: Provider = {
  provide: ConfigService,
  useClass: MockConfigService,
};
