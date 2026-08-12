import { Test, TestingModule } from '@nestjs/testing';
import * as eventPayload from '@test/data/event.application.created.payload.json';
import NotifmeSdk, { NotificationStatus } from 'notifme-sdk';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
import {
  MockConfigServiceProvider,
  MockNotifmeProvider,
  MockWinstonProvider,
} from '@test/mocks';
import {
  NotificationEventPayloadSpaceCommunityApplication,
  NotificationEventPayloadUserEmailChangeSpaceAdmin,
  BaseEventPayload,
} from '@alkemio/notifications-lib';
import { NotificationTemplateBuilder } from '@src/services/notifme';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { NotificationBlacklistService } from './notification.blacklist.service';
import { NOTIFICATIONS_PROVIDER } from '@src/common/enums/providers';
import { NotificationEvent } from '@src/generated/alkemio-schema';
import { RmqContext } from '@nestjs/microservices';
import { NotificationTemplateType } from '@src/types/notification.template.type';

// ---------------------------------------------------------------------------
// Shared fixtures
// ---------------------------------------------------------------------------

const MINIMAL_RECIPIENT = {
  id: 'r1',
  firstName: 'Rita',
  lastName: 'Recipient',
  email: 'rita@example.com',
  type: 'USER',
  profile: {
    displayName: 'Rita Recipient',
    url: 'https://alkemio.dev/users/r1',
  },
};

const MINIMAL_BASE: Omit<BaseEventPayload, 'eventType'> = {
  triggeredBy: {
    id: 'tb1',
    firstName: 'Alice',
    lastName: 'Actor',
    email: 'alice@example.com',
    type: 'USER',
    profile: {
      displayName: 'Alice Actor',
      url: 'https://alkemio.dev/users/tb1',
    },
  },
  recipients: [MINIMAL_RECIPIENT],
  platform: { url: 'https://alkemio.dev' },
};

/** Returns a BaseEventPayload with just the eventType + minimal base fields. */
const mkPayload = (eventType: string): BaseEventPayload =>
  ({ ...MINIMAL_BASE, eventType }) as BaseEventPayload;

/** Minimal rendered template for spying on templateBuilder. */
const MINIMAL_TEMPLATE: NotificationTemplateType = {
  name: 'test.template',
  title: 'Test',
  version: 1,
  channels: {
    email: {
      from: '',
      to: 'rita@example.com',
      subject: 'Test',
      html: '<p>Test</p>',
    },
  },
};

/** Minimal base email payload returned by mocked builder methods. */
const MINIMAL_EMAIL_PAYLOAD = {
  recipient: {
    firstName: 'Rita',
    email: 'rita@example.com',
    notificationPreferences:
      'https://alkemio.dev/users/r1/settings/notifications',
  },
  platform: { url: 'https://alkemio.dev' },
};

// ---------------------------------------------------------------------------
// RmqContext factory
// ---------------------------------------------------------------------------

const createRmqContext = () => {
  const channel = {
    ack: jest.fn(),
    nack: jest.fn(),
    reject: jest.fn(),
  };
  const message = {};
  const context = {
    getChannelRef: () => channel,
    getMessage: () => message,
  } as unknown as RmqContext;
  return { context, channel };
};

// ---------------------------------------------------------------------------
// Module setup
// ---------------------------------------------------------------------------

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notifmeService: NotifmeSdk;
  let configService: ConfigService;
  let builderService: NotificationEmailPayloadBuilderService;
  let templateBuilder: NotificationTemplateBuilder;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        MockConfigServiceProvider,
        MockNotifmeProvider,
        MockWinstonProvider,
        NotificationService,
        NotificationEmailPayloadBuilderService,
        NotificationBlacklistService,
        NotificationTemplateBuilder,
      ],
    }).compile();

    notificationService =
      moduleRef.get<NotificationService>(NotificationService);
    notifmeService = moduleRef.get(NOTIFICATIONS_PROVIDER);
    configService = moduleRef.get(ConfigService);
    builderService = moduleRef.get(NotificationEmailPayloadBuilderService);
    templateBuilder = moduleRef.get(NotificationTemplateBuilder);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  /** Standard config mock used in most tests. */
  const mockSuccessConfig = () =>
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'notification_providers') {
        return {
          email: {
            from: 'noreply@alkemio.dev',
            from_name: 'Alkemio',
            blacklist: '',
          },
        };
      }
      if (key === 'alkemio') {
        return { webclient_invitations_path: '/invitations' };
      }
      return undefined;
    });

  // -------------------------------------------------------------------------
  // Existing smoke tests (preserved)
  // -------------------------------------------------------------------------

  describe('Application Notifications (smoke)', () => {
    beforeEach(() => mockSuccessConfig());

    it('should send an application notification successfully', async () => {
      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      const res = await notificationService.buildAndSendEmailNotifications(
        (eventPayload as any)
          .data as NotificationEventPayloadSpaceCommunityApplication
      );
      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }
    });

    it('should send 3 application notifications (one per recipient)', async () => {
      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      const res = await notificationService.buildAndSendEmailNotifications(
        (eventPayload as any)
          .data as NotificationEventPayloadSpaceCommunityApplication
      );

      for (const notificationStatus of res) {
        expect(
          (notificationStatus as PromiseFulfilledResult<NotificationStatus>)
            .value.status
        ).toBe('success');
      }
      expect(res.length).toBe(3);
    });
  });

  // -------------------------------------------------------------------------
  // buildAndSendEmailNotifications — guard paths
  // -------------------------------------------------------------------------

  describe('buildAndSendEmailNotifications — guard paths', () => {
    beforeEach(() => mockSuccessConfig());

    it('returns [] when recipients array is empty', async () => {
      const payload = {
        ...mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        recipients: [],
      };
      const result =
        await notificationService.buildAndSendEmailNotifications(payload);
      expect(result).toEqual([]);
    });

    it('returns [] when all recipients are blacklisted', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'notification_providers') {
          return {
            email: {
              from: 'noreply@alkemio.dev',
              from_name: 'Alkemio',
              blacklist: MINIMAL_RECIPIENT.email,
            },
          };
        }
        if (key === 'alkemio') {
          return { webclient_invitations_path: '/invitations' };
        }
        return undefined;
      });

      // Re-create service so blacklist loads from the updated config
      const freshModule = await Test.createTestingModule({
        providers: [
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockImplementation((key: string) => {
                if (key === 'notification_providers') {
                  return {
                    email: {
                      from: 'noreply@alkemio.dev',
                      blacklist: MINIMAL_RECIPIENT.email,
                    },
                  };
                }
                if (key === 'alkemio') {
                  return { webclient_invitations_path: '/invitations' };
                }
                return undefined;
              }),
            },
          },
          MockNotifmeProvider,
          MockWinstonProvider,
          NotificationService,
          NotificationEmailPayloadBuilderService,
          NotificationBlacklistService,
          NotificationTemplateBuilder,
        ],
      }).compile();

      const freshService =
        freshModule.get<NotificationService>(NotificationService);
      const result = await freshService.buildAndSendEmailNotifications(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication)
      );
      expect(result).toEqual([]);
      await freshModule.close();
    });

    it('throws EventPayloadNotProvidedException for an unknown event type', async () => {
      jest.spyOn(templateBuilder, 'buildTemplate').mockResolvedValue(undefined);
      const payload = mkPayload('UNKNOWN_EVENT_TYPE_XYZ');
      await expect(
        notificationService.buildAndSendEmailNotifications(payload)
      ).rejects.toThrow();
    });

    it('logs a warning and continues when buildTemplate rejects (line 187)', async () => {
      // buildTemplate rejects → notification is skipped → empty send list → acks
      jest
        .spyOn(
          builderService,
          'createEmailTemplatePayloadSpaceAdminCommunityApplication'
        )
        .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
      jest
        .spyOn(templateBuilder, 'buildTemplate')
        .mockRejectedValue(new Error('Template render error'));

      const result = await notificationService.buildAndSendEmailNotifications(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication)
      );

      // All templates failed to build, so nothing is sent
      expect(result).toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // sendNotification — error paths (tested via buildAndSendEmailNotifications)
  // -------------------------------------------------------------------------

  describe('sendNotification — error paths', () => {
    beforeEach(() => mockSuccessConfig());

    it('handles template with no channels (rejected) and logs warning', async () => {
      jest
        .spyOn(
          builderService,
          'createEmailTemplatePayloadSpaceAdminCommunityApplication'
        )
        .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
      // buildTemplate returns a template with no channels → NotificationNoChannelsException
      jest.spyOn(templateBuilder, 'buildTemplate').mockResolvedValue({
        ...MINIMAL_TEMPLATE,
        channels: {},
      });

      const res = await notificationService.buildAndSendEmailNotifications(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication)
      );
      // sendNotification throws, which means the notification is rejected
      expect(res.length).toBeGreaterThanOrEqual(1);
      const rejected = res.filter(r => r.status === 'rejected');
      expect(rejected.length).toBeGreaterThanOrEqual(1);
    });

    it('returns { status: "error" } when email channel is missing', async () => {
      jest
        .spyOn(
          builderService,
          'createEmailTemplatePayloadSpaceAdminCommunityApplication'
        )
        .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
      jest.spyOn(templateBuilder, 'buildTemplate').mockResolvedValue({
        ...MINIMAL_TEMPLATE,
        channels: { sms: undefined },
      } as any);

      const res = await notificationService.buildAndSendEmailNotifications(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication)
      );
      const fulfilled = res.filter(
        r => r.status === 'fulfilled'
      ) as PromiseFulfilledResult<NotificationStatus>[];
      expect(fulfilled.some(r => r.value.status === 'error')).toBe(true);
    });

    it('returns { status: "error" } when mailFrom is not configured', async () => {
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        if (key === 'notification_providers') {
          return { email: { from: undefined, blacklist: '' } };
        }
        if (key === 'alkemio') {
          return { webclient_invitations_path: '/invitations' };
        }
        return undefined;
      });
      jest
        .spyOn(
          builderService,
          'createEmailTemplatePayloadSpaceAdminCommunityApplication'
        )
        .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
      jest
        .spyOn(templateBuilder, 'buildTemplate')
        .mockResolvedValue(MINIMAL_TEMPLATE);

      const res = await notificationService.buildAndSendEmailNotifications(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication)
      );
      const fulfilled = res.filter(
        r => r.status === 'fulfilled'
      ) as PromiseFulfilledResult<NotificationStatus>[];
      expect(fulfilled.some(r => r.value.status === 'error')).toBe(true);
    });

    it('returns { status: "error" } when notifme.send throws', async () => {
      mockSuccessConfig();
      jest
        .spyOn(
          builderService,
          'createEmailTemplatePayloadSpaceAdminCommunityApplication'
        )
        .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
      jest
        .spyOn(templateBuilder, 'buildTemplate')
        .mockResolvedValue(MINIMAL_TEMPLATE);
      jest
        .spyOn(notifmeService, 'send')
        .mockRejectedValue(new Error('Network error'));

      const res = await notificationService.buildAndSendEmailNotifications(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication)
      );
      const fulfilled = res.filter(
        r => r.status === 'fulfilled'
      ) as PromiseFulfilledResult<NotificationStatus>[];
      expect(fulfilled.some(r => r.value.status === 'error')).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // createEmailPayloadForEvent / getEmailTemplateToUseForEvent — all switch
  // cases covered by routing each NotificationEvent through the service
  // -------------------------------------------------------------------------

  describe('event routing — all NotificationEvent types', () => {
    beforeEach(() => {
      mockSuccessConfig();
      // Mock ALL builder methods to return a minimal payload
      Object.getOwnPropertyNames(
        NotificationEmailPayloadBuilderService.prototype
      )
        .filter(m => m.startsWith('createEmail'))
        .forEach(m => {
          jest
            .spyOn(builderService, m as any)
            .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
        });
      // Mock template builder to return a minimal template
      jest
        .spyOn(templateBuilder, 'buildTemplate')
        .mockResolvedValue(MINIMAL_TEMPLATE);
      // Mock notifme to return success
      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });
    });

    const allEvents = Object.values(NotificationEvent);

    it.each(allEvents)(
      'routes event %s to the correct builder and template',
      async eventType => {
        const res = await notificationService.buildAndSendEmailNotifications(
          mkPayload(eventType)
        );
        expect(res.length).toBeGreaterThanOrEqual(1);
        const fulfilled = res.filter(
          (r): r is PromiseFulfilledResult<NotificationStatus> =>
            r.status === 'fulfilled'
        );
        expect(fulfilled.length).toBeGreaterThanOrEqual(1);
        expect(fulfilled.every(r => r.value?.status === 'success')).toBe(true);
      }
    );
  });

  // -------------------------------------------------------------------------
  // processNotificationEvent — channel ACK/NACK/reject branches
  // -------------------------------------------------------------------------

  describe('processNotificationEvent', () => {
    beforeEach(() => {
      mockSuccessConfig();
      Object.getOwnPropertyNames(
        NotificationEmailPayloadBuilderService.prototype
      )
        .filter(m => m.startsWith('createEmail'))
        .forEach(m => {
          jest
            .spyOn(builderService, m as any)
            .mockReturnValue(MINIMAL_EMAIL_PAYLOAD as any);
        });
      jest
        .spyOn(templateBuilder, 'buildTemplate')
        .mockResolvedValue(MINIMAL_TEMPLATE);
      // The requeue path now backs off before rejecting. Stub it out so these
      // tests stay fast; the backoff itself is asserted in its own test below.
      jest
        .spyOn(notificationService as any, 'delayBeforeRequeue')
        .mockResolvedValue(undefined);
    });

    it('acks when all notifications sent successfully', async () => {
      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });
      const { context, channel } = createRmqContext();

      await notificationService.processNotificationEvent(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        context
      );

      expect(channel.ack).toHaveBeenCalledTimes(1);
      expect(channel.nack).not.toHaveBeenCalled();
      expect(channel.reject).not.toHaveBeenCalled();
    });

    it('acks when no notifications were sent (empty result)', async () => {
      // Force empty result by using empty recipients
      const payload = {
        ...mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        recipients: [],
      };
      const { context, channel } = createRmqContext();

      await notificationService.processNotificationEvent(payload, context);

      expect(channel.ack).toHaveBeenCalledTimes(1);
    });

    it('rejects with requeue when ALL notifications failed', async () => {
      // Empty channels → sendNotification throws → Promise.allSettled records as rejected
      jest.spyOn(templateBuilder, 'buildTemplate').mockResolvedValue({
        ...MINIMAL_TEMPLATE,
        channels: {},
      });
      const { context, channel } = createRmqContext();

      await notificationService.processNotificationEvent(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        context
      );

      expect(channel.reject).toHaveBeenCalledWith(expect.anything(), true);
      expect(channel.ack).not.toHaveBeenCalled();
    });

    // -----------------------------------------------------------------------
    // A send can fail by REJECTING or by RESOLVING with notifme's
    // `{ status: 'error' }` — `sendNotification` catches every transport error
    // and returns the latter. Classifying only rejections as failures meant a
    // total SMTP outage was logged as "successfully sent" and ACKED, silently
    // discarding the notification, and made the bounded-retry path below
    // unreachable for the transient outage it exists to handle.
    // -----------------------------------------------------------------------
    describe('a resolved-but-errored send counts as a failure', () => {
      it('does NOT ack when every send resolves with status=error', async () => {
        jest
          .spyOn(notifmeService, 'send')
          .mockResolvedValue({ status: 'error' } as any);
        const { context, channel } = createRmqContext();

        await notificationService.processNotificationEvent(
          mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
          context
        );

        expect(channel.ack).not.toHaveBeenCalled();
        expect(channel.reject).toHaveBeenCalledWith(expect.anything(), true);
      });

      it('nacks without requeue when only SOME sends resolve with status=error', async () => {
        jest
          .spyOn(notifmeService, 'send')
          .mockResolvedValueOnce({ status: 'error' } as any)
          .mockResolvedValue({ status: 'success' } as any);
        const payload = {
          ...mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
          recipients: [{ email: 'a@alkem.io' }, { email: 'b@alkem.io' }] as any,
        };
        const { context, channel } = createRmqContext();

        await notificationService.processNotificationEvent(payload, context);

        expect(channel.ack).not.toHaveBeenCalled();
        expect(channel.nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false
        );
      });

      it('backs off before requeueing, so the attempt cap is not burned instantly', async () => {
        jest
          .spyOn(notifmeService, 'send')
          .mockResolvedValue({ status: 'error' } as any);
        const backoff = jest.spyOn(
          notificationService as any,
          'delayBeforeRequeue'
        );
        const { context, channel } = createRmqContext();

        await notificationService.processNotificationEvent(
          mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
          context
        );

        expect(backoff).toHaveBeenCalledWith(1);
        // And the backoff completes before the requeue is issued.
        expect(backoff.mock.invocationCallOrder[0]).toBeLessThan(
          (channel.reject as jest.Mock).mock.invocationCallOrder[0]
        );
      });
    });

    // -----------------------------------------------------------------------
    // 034-messaging-notifications (FR-015/D-16), fixed per review findings
    // corr/spec/qual/sec-notifications-2/3: bounded redelivery on the
    // all-failed path. RabbitMQ never stamps `x-death` on this queue (no
    // dead-letter-exchange is configured), so the bound is now tracked
    // in-process, keyed by message identity — these tests drive it by
    // calling processNotificationEvent repeatedly with a context whose
    // message carries the SAME `messageId`, exactly mirroring how the
    // broker would redeliver the identical message, rather than hand-
    // injecting a header the broker cannot produce here.
    // -----------------------------------------------------------------------
    describe('bounded redelivery (FR-015/D-16)', () => {
      /** RmqContext whose message carries the given stable identity. */
      const createRmqContextWithMessageId = (messageId: string) => {
        const channel = {
          ack: jest.fn(),
          nack: jest.fn(),
          reject: jest.fn(),
        };
        const message = { properties: { messageId } };
        const context = {
          getChannelRef: () => channel,
          getMessage: () => message,
        } as unknown as RmqContext;
        return { context, channel };
      };

      beforeEach(() => {
        jest.spyOn(templateBuilder, 'buildTemplate').mockResolvedValue({
          ...MINIMAL_TEMPLATE,
          channels: {},
        });
      });

      it('requeues on the first delivery of a message (first attempt)', async () => {
        const { context, channel } =
          createRmqContextWithMessageId('msg-first-attempt');

        await notificationService.processNotificationEvent(
          mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
          context
        );

        expect(channel.reject).toHaveBeenCalledWith(expect.anything(), true);
      });

      it('still requeues redeliveries 2 and 3 of the same message (below the cap)', async () => {
        const messageId = 'msg-below-cap';

        for (let attempt = 1; attempt <= 2; attempt++) {
          const { context, channel } = createRmqContextWithMessageId(messageId);

          await notificationService.processNotificationEvent(
            mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
            context
          );

          expect(channel.reject).toHaveBeenCalledWith(expect.anything(), true);
        }
      });

      it('rejects WITHOUT requeue once the same message has been attempted MAX_REDELIVERY_ATTEMPTS times, and logs an error', async () => {
        const messageId = 'msg-at-cap';
        let lastChannel!: { reject: jest.Mock };

        for (let attempt = 1; attempt <= 3; attempt++) {
          const { context, channel } = createRmqContextWithMessageId(messageId);
          lastChannel = channel;

          await notificationService.processNotificationEvent(
            mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
            context
          );
        }

        expect(lastChannel.reject).toHaveBeenCalledWith(
          expect.anything(),
          false
        );
      });

      it('tracks attempts independently per message identity', async () => {
        // Drive message A through 2 attempts (still below the cap)...
        for (let attempt = 1; attempt <= 2; attempt++) {
          const { context } =
            createRmqContextWithMessageId('msg-independent-a');
          await notificationService.processNotificationEvent(
            mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
            context
          );
        }

        // ...message B's own FIRST attempt is unaffected by A's count and
        // still requeues rather than inheriting A's attempt total.
        const { context: contextB, channel: channelB } =
          createRmqContextWithMessageId('msg-independent-b');
        await notificationService.processNotificationEvent(
          mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
          contextB
        );

        expect(channelB.reject).toHaveBeenCalledWith(expect.anything(), true);
      });

      it('leaves the partial-failure (nack) path unchanged regardless of prior attempts', async () => {
        let buildCount = 0;
        jest
          .spyOn(templateBuilder, 'buildTemplate')
          .mockImplementation(async () => {
            buildCount++;
            return buildCount === 1
              ? MINIMAL_TEMPLATE
              : { ...MINIMAL_TEMPLATE, channels: {} };
          });
        jest
          .spyOn(notifmeService, 'send')
          .mockResolvedValue({ status: 'success' });

        const payload = {
          ...mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
          recipients: [
            MINIMAL_RECIPIENT,
            { ...MINIMAL_RECIPIENT, id: 'r2', email: 'r2@example.com' },
          ],
        };
        const { context, channel } = createRmqContextWithMessageId(
          'msg-partial-failure'
        );

        await notificationService.processNotificationEvent(payload, context);

        expect(channel.nack).toHaveBeenCalledWith(
          expect.anything(),
          false,
          false
        );
        expect(channel.reject).not.toHaveBeenCalled();
      });
    });

    it('nacks (without requeue) when SOME notifications failed', async () => {
      // First buildTemplate succeeds (valid channels), second returns empty channels
      // → second sendNotification throws → partial rejection
      let buildCount = 0;
      jest
        .spyOn(templateBuilder, 'buildTemplate')
        .mockImplementation(async () => {
          buildCount++;
          return buildCount === 1
            ? MINIMAL_TEMPLATE
            : { ...MINIMAL_TEMPLATE, channels: {} };
        });
      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });

      // Use a payload with 2 recipients so 2 notifications are sent
      const payload = {
        ...mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        recipients: [
          MINIMAL_RECIPIENT,
          { ...MINIMAL_RECIPIENT, id: 'r2', email: 'r2@example.com' },
        ],
      };
      const { context, channel } = createRmqContext();

      await notificationService.processNotificationEvent(payload, context);

      expect(channel.nack).toHaveBeenCalledWith(
        expect.anything(),
        false,
        false
      );
      expect(channel.ack).not.toHaveBeenCalled();
      expect(channel.reject).not.toHaveBeenCalled();
    });

    // 034-messaging-notifications review fix (corr-notifications-2,
    // qual-notifications-2, sec-notifications-1): an unexpected exception —
    // whether thrown while building/sending (e.g. a schema-drift bug) or,
    // as simulated here, while doing the ack/nack bookkeeping — is a
    // deterministic code/schema bug that will very likely recur on every
    // redelivery. It is now caught and discarded immediately (nack, no
    // requeue) rather than requeued, bounded or not, matching the pre-034
    // fail-safe behaviour: retrying a bug offers no value and risks an
    // unbounded hot loop on this single-replica consumer.
    it('discards (nack, no requeue) on unexpected exception, and never requeues even on repeated occurrences', async () => {
      // channel.ack throwing inside the try block triggers the catch handler
      jest
        .spyOn(notifmeService, 'send')
        .mockResolvedValue({ status: 'success' });
      const channel = {
        ack: jest.fn().mockImplementation(() => {
          throw new Error('Channel failure');
        }),
        nack: jest.fn(),
        reject: jest.fn(),
      };
      const context = {
        getChannelRef: () => channel,
        getMessage: () => ({}),
      } as unknown as RmqContext;

      // Run it twice — a deterministic bug would throw identically on
      // redelivery; it must be discarded every time, never requeued.
      await notificationService.processNotificationEvent(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        context
      );
      await notificationService.processNotificationEvent(
        mkPayload(NotificationEvent.SpaceAdminCommunityApplication),
        context
      );

      expect(channel.nack).toHaveBeenCalledTimes(2);
      expect(channel.nack).toHaveBeenCalledWith(
        expect.anything(),
        false,
        false
      );
      expect(channel.reject).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // createEmailTemplatePayloadSpaceAdminUserEmailChange — builder unit coverage
  // -------------------------------------------------------------------------

  describe('createEmailTemplatePayloadSpaceAdminUserEmailChange', () => {
    // The event-routing / processNotificationEvent suites spy on every builder
    // method; restore originals so this suite exercises the real builder.
    beforeEach(() => jest.restoreAllMocks());

    const mkSpaceAdminEvent = (
      overrides: Partial<NotificationEventPayloadUserEmailChangeSpaceAdmin> = {}
    ): NotificationEventPayloadUserEmailChangeSpaceAdmin =>
      ({
        ...MINIMAL_BASE,
        eventType: NotificationEvent.UserEmailChangeSpaceAdminNotification,
        space: {
          id: 's-1',
          level: '0',
          profile: {
            displayName: 'Climate Space',
            url: 'https://alkemio.dev/climate',
          },
          adminURL: 'https://alkemio.dev/climate/settings',
        },
        subjectProfileSummary: { id: 'u-subj', displayName: 'Sam Subject' },
        oldEmail: 'old.address@example.com',
        newEmail: 'new.address@example.com',
        initiatorProfileSummary: { id: 'u-init', displayName: 'Ada Admin' },
        initiatorRole: 'platform_admin',
        commitTimestampISO8601: '2026-05-20T14:32:00.000Z',
        triggerOutcome: 'COMMITTED',
        ...overrides,
      }) as NotificationEventPayloadUserEmailChangeSpaceAdmin;

    const build = (
      overrides?: Partial<NotificationEventPayloadUserEmailChangeSpaceAdmin>
    ) =>
      builderService.createEmailTemplatePayloadSpaceAdminUserEmailChange(
        mkSpaceAdminEvent(overrides),
        MINIMAL_RECIPIENT as any
      );

    it('passes the full old and new email addresses through unchanged', () => {
      const payload = build();
      expect(payload.oldEmail).toBe('old.address@example.com');
      expect(payload.newEmail).toBe('new.address@example.com');
    });

    it('names the subject and the space the event concerns', () => {
      const payload = build();
      expect(payload.subjectName).toBe('Sam Subject');
      expect(payload.space.displayName).toBe('Climate Space');
      expect(payload.space.type).toBe('space');
    });

    it('uses the initiator display name and isSelfInitiated=false for an admin-initiated change', () => {
      const payload = build();
      expect(payload.isSelfInitiated).toBe(false);
      expect(payload.initiatorName).toBe('Ada Admin');
    });

    it('falls back initiatorName to the subject and sets isSelfInitiated=true when self-initiated', () => {
      const payload = build({
        initiatorRole: 'self',
        initiatorProfileSummary: undefined,
      });
      expect(payload.isSelfInitiated).toBe(true);
      expect(payload.initiatorName).toBe('Sam Subject');
    });

    it('renders changedAt in UTC with an explicit UTC label', () => {
      const payload = build();
      expect(payload.changedAt).toBe('20 May 2026, 14:32 UTC');
    });
  });
});
