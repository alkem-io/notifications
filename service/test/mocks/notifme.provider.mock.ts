import NotifmeSdk from 'notifme-sdk';
import { ValueProvider } from '@nestjs/common';
import { PublicPart } from '@test/utils';
import { NOTIFICATIONS_PROVIDER } from '@common';

export const MockNotifmeProvider: ValueProvider<PublicPart<NotifmeSdk>> = {
  provide: NOTIFICATIONS_PROVIDER,
  useValue: {
    send: jest.fn(),
  },
};
