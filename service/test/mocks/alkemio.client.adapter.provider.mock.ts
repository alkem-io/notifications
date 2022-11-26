import { ALKEMIO_CLIENT_ADAPTER } from '@common';
import { ValueProvider } from '@nestjs/common';
import { PublicPart } from 'service/test/utils';
import { AlkemioClientAdapter } from '@src/services';

export const MockAlkemioClientAdapterProvider: ValueProvider<
  PublicPart<AlkemioClientAdapter>
> = {
  provide: ALKEMIO_CLIENT_ADAPTER,
  useValue: {
    areNotificationsEnabled: jest.fn(),
    getUser: jest.fn(),
    getUsersMatchingCredentialCriteria: jest.fn(),
    getUniqueUsersMatchingCredentialCriteria: jest.fn(),
  },
};
