import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockType } from '@test/utils/mock.type';

class MockConfigService implements MockType<ConfigService> {
  get() {
    throw new Error('Not implemented');
  }
}

export const MockConfigServiceProvider: Provider = {
  provide: ConfigService,
  useClass: MockConfigService,
};
