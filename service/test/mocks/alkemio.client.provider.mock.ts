import { ValueProvider } from '@nestjs/common';
import { PublicPart } from 'service/test/utils';
import { ALKEMIO_CLIENT_PROVIDER } from '@common';
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
