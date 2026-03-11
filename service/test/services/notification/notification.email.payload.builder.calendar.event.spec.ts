import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import { NotificationEventPayloadSpaceCalendarEvent } from '@alkemio/notifications-lib';
import { User } from '@core/models';

type CalendarEventOverrides = Partial<
  NotificationEventPayloadSpaceCalendarEvent['calendarEvent']
>;

type EventOverrides = Partial<NotificationEventPayloadSpaceCalendarEvent>;

describe('NotificationEmailPayloadBuilderService', () => {
  const recipient: User = {
    id: 'recipient-1',
    firstName: 'Rita',
    lastName: 'Recipient',
    email: 'rita@example.com',
    profile: {
      displayName: 'Rita Recipient',
      url: 'https://alkemio.dev/users/recipient-1',
    },
  };

  const baseEventPayload: NotificationEventPayloadSpaceCalendarEvent = {
    eventType: 'SpaceCommunityCalendarEventCreated',
    triggeredBy: {
      id: 'creator-1',
      firstName: 'Chris',
      lastName: 'Creator',
      email: 'chris@example.com',
      type: 'USER',
      profile: {
        displayName: 'Chris Creator',
        url: 'https://alkemio.dev/users/creator-1',
      },
    },
    recipients: [
      {
        id: 'recipient-1',
        firstName: 'Rita',
        lastName: 'Recipient',
        email: 'rita@example.com',
        type: 'USER',
        profile: {
          displayName: 'Rita Recipient',
          url: 'https://alkemio.dev/users/recipient-1',
        },
      },
    ],
    platform: {
      url: 'https://alkemio.dev',
    },
    space: {
      id: 'space-1',
      level: '0',
      profile: {
        displayName: 'Solaris Lab',
        url: 'https://alkemio.dev/spaces/solaris',
      },
      adminURL: 'https://alkemio.dev/spaces/solaris/admin',
    },
    calendarEvent: {
      id: 'event-1',
      title: 'Community Sync',
      type: 'MEETING',
      createdBy: {
        id: 'creator-1',
        firstName: 'Chris',
        lastName: 'Creator',
        email: 'chris@example.com',
        type: 'USER',
        profile: {
          displayName: 'Chris Creator',
          url: 'https://alkemio.dev/users/creator-1',
        },
      },
      url: 'https://alkemio.dev/spaces/solaris/calendar/event-1',
      startDate: '2025-02-01T10:15:00.000Z',
      endDate: '2025-02-01T11:45:00.000Z',
      wholeDay: false,
      description: 'Monthly community sync-up.',
      location: 'Room 5',
      googleCalendarUrl: 'https://calendar.google.com/event?eid=event-1',
      outlookCalendarUrl: 'https://outlook.live.com/calendar/event-1',
      icsDownloadUrl: 'https://alkemio.dev/calendar/event-1.ics',
    },
  };

  const createEventPayload = (
    calendarEventOverrides: CalendarEventOverrides = {},
    eventOverrides: EventOverrides = {}
  ): NotificationEventPayloadSpaceCalendarEvent => ({
    ...baseEventPayload,
    ...eventOverrides,
    calendarEvent: {
      ...baseEventPayload.calendarEvent,
      ...calendarEventOverrides,
    },
  });

  const createService = () => {
    const configService = {
      get: jest.fn().mockReturnValue({
        webclient_invitations_path: '/invitations',
      }),
    } as unknown as ConfigService;

    return new NotificationEmailPayloadBuilderService(configService);
  };

  describe('createEmailTemplatePayloadSpaceCommunityCalendarEventCreated', () => {
    it('builds payload with time when wholeDay is false', () => {
      const service = createService();
      const payload = createEventPayload();

      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
          payload,
          recipient
        );

      expect(result.calendarEvent.wholeDay).toBe(false);
      expect(result.calendarEvent.formattedStartDate).toContain('10:15');
      expect(result.calendarEvent.formattedEndDate).toContain('11:45');
      expect(result.calendarEvent.location).toBe('Room 5');
      expect(result.calendarEvent.googleCalendarUrl).toBe(
        'https://calendar.google.com/event?eid=event-1'
      );
      expect(result.calendarEvent.outlookCalendarUrl).toBe(
        'https://outlook.live.com/calendar/event-1'
      );
      expect(result.calendarEvent.icsDownloadUrl).toBe(
        'https://alkemio.dev/calendar/event-1.ics'
      );
      expect(result.space.type).toBe('space');
    });

    it('omits formatted end date when start and end match', () => {
      const service = createService();
      const payload = createEventPayload({
        wholeDay: true,
        startDate: '2025-02-02T00:00:00.000Z',
        endDate: '2025-02-02T00:00:00.000Z',
      });

      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
          payload,
          recipient
        );

      expect(result.calendarEvent.wholeDay).toBe(true);
      expect(result.calendarEvent.formattedStartDate).not.toMatch(
        /\d{1,2}:\d{2}/
      );
      expect(result.calendarEvent.formattedEndDate).toBeNull();
    });

    it('keeps location optional and preserves base fields', () => {
      const service = createService();
      const payload = createEventPayload({
        location: undefined,
      });

      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
          payload,
          recipient
        );

      expect(result.calendarEvent.location).toBeUndefined();
      expect(result.creator.name).toBe('Chris Creator');
      expect(result.creator.profile).toBe(
        'https://alkemio.dev/users/creator-1'
      );
      expect(result.space.displayName).toBe('Solaris Lab');
      expect(result.recipient.notificationPreferences).toBe(
        'https://alkemio.dev/users/recipient-1/settings/notifications'
      );
    });

    it('identifies subspace correctly based on space level', () => {
      const service = createService();
      const payload = createEventPayload(
        {},
        {
          space: {
            ...baseEventPayload.space,
            level: '1',
          },
        }
      );

      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
          payload,
          recipient
        );

      expect(result.space.type).toBe('subspace');
      expect(result.space.level).toBe('1');
    });

    it('preserves calendar event type and description', () => {
      const service = createService();
      const payload = createEventPayload({
        type: 'DEADLINE',
        description: 'Final project submission deadline.',
      });

      const result =
        service.createEmailTemplatePayloadSpaceCommunityCalendarEventCreated(
          payload,
          recipient
        );

      expect(result.calendarEvent.type).toBe('DEADLINE');
      expect(result.calendarEvent.description).toBe(
        'Final project submission deadline.'
      );
      expect(result.calendarEvent.title).toBe('Community Sync');
      expect(result.calendarEvent.url).toBe(
        'https://alkemio.dev/spaces/solaris/calendar/event-1'
      );
    });
  });
});
