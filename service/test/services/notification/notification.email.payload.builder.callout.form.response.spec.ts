import { ConfigService } from '@nestjs/config';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import { NotificationEventPayloadSpaceCollaborationCalloutFormResponse } from '@src/types/notifications.lib.callout.form.response.bridge';
import { User } from '@core/models';

const recipient: User = {
  id: 'admin-1',
  firstName: 'Ada',
  lastName: 'Admin',
  email: 'ada@example.com',
  profile: {
    displayName: 'Ada Admin',
    url: 'https://alkemio.dev/users/admin-1',
  },
};

const submitter = {
  id: 'submitter-1',
  firstName: 'Sam',
  lastName: 'Submitter',
  email: 'sam@example.com',
  type: 'USER',
  profile: {
    displayName: 'Sam Submitter',
    url: 'https://alkemio.dev/users/submitter-1',
  },
};

const buildPayload = (
  visibility: 'ADMINS' | 'MEMBERS'
): NotificationEventPayloadSpaceCollaborationCalloutFormResponse => ({
  eventType: 'SPACE_ADMIN_COLLABORATION_CALLOUT_FORM_RESPONSE',
  triggeredBy: submitter,
  recipients: [
    {
      id: 'admin-1',
      firstName: 'Ada',
      lastName: 'Admin',
      email: 'ada@example.com',
      type: 'USER',
      profile: {
        displayName: 'Ada Admin',
        url: 'https://alkemio.dev/users/admin-1',
      },
    },
  ],
  platform: { url: 'https://alkemio.dev' },
  space: {
    id: 'space-1',
    level: '0',
    profile: {
      displayName: 'Innovation Hub',
      url: 'https://alkemio.dev/spaces/innovation',
    },
    adminURL: 'https://alkemio.dev/spaces/innovation/admin',
  },
  callout: {
    id: 'callout-1',
    displayName: 'Onboarding survey',
    url: 'https://alkemio.dev/spaces/innovation/collaboration/onboarding-survey',
  },
  formResponse: {
    id: 'response-1',
    submittedAt: '2026-09-29T10:00:00.000Z',
    visibility,
  },
  submitter,
});

const createService = () => {
  const configService = {
    get: jest.fn().mockReturnValue({
      webclient_invitations_path: '/invitations',
    }),
  } as unknown as ConfigService;
  return new NotificationEmailPayloadBuilderService(configService);
};

const collectKeys = (value: unknown, keys: string[] = []): string[] => {
  if (Array.isArray(value)) {
    value.forEach(v => collectKeys(v, keys));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      keys.push(k);
      collectKeys(v, keys);
    }
  }
  return keys;
};

describe('NotificationEmailPayloadBuilderService — Form response notifications', () => {
  const service = createService();

  describe.each([
    [
      'admin event',
      (p: NotificationEventPayloadSpaceCollaborationCalloutFormResponse) =>
        service.createEmailTemplatePayloadSpaceAdminCollaborationCalloutFormResponse(
          p,
          recipient
        ),
    ],
    [
      'submitter receipt',
      (p: NotificationEventPayloadSpaceCollaborationCalloutFormResponse) =>
        service.createEmailTemplatePayloadUserCollaborationCalloutFormResponseReceipt(
          p,
          recipient
        ),
    ],
  ])('%s', (_name, build) => {
    it('maps space, callout, submitter and response metadata', () => {
      const result = build(buildPayload('ADMINS'));

      expect(result.space.displayName).toBe('Innovation Hub');
      expect(result.callout).toEqual({
        displayName: 'Onboarding survey',
        url: 'https://alkemio.dev/spaces/innovation/collaboration/onboarding-survey',
      });
      expect(result.submitter.displayName).toBe('Sam Submitter');
      expect(result.formResponse).toEqual({
        submittedAt: '2026-09-29T10:00:00.000Z',
        visibility: 'ADMINS',
      });
      expect(result.recipient.email).toBe('ada@example.com');
    });

    it('states that only the space admins can read an ADMINS response', () => {
      expect(build(buildPayload('ADMINS')).whoCanRead).toBe(
        'Only the admins of Innovation Hub can read your response'
      );
    });

    it('states that members can read a MEMBERS response', () => {
      expect(build(buildPayload('MEMBERS')).whoCanRead).toBe(
        'Members of Innovation Hub can read your response'
      );
    });

    it('never carries an answer, prompt, question or text key', () => {
      const keys = collectKeys(build(buildPayload('MEMBERS')));
      const offending = keys.filter(k =>
        /answer|prompt|question|text/i.test(k)
      );

      expect(offending).toEqual([]);
    });
  });
});
