import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { ALKEMIO_CLIENT_PROVIDER } from '@common/enums';
import { AlkemioClient } from '@alkemio/client-lib';

export const MockAlkemioClientProvider: ValueProvider<
  PublicPart<AlkemioClient>
> = {
  provide: ALKEMIO_CLIENT_PROVIDER,
  useValue: {
    usersWithAuthorizationCredential: jest.fn(),
    user: jest.fn(),
    featureFlags: jest.fn(),
  },
};
