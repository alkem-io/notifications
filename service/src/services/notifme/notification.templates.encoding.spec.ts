import fs from 'fs';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  NotificationEventPayloadOrganizationMessageDirect,
  NotificationEventPayloadSpaceCommunicationMessageDirect,
  NotificationEventPayloadSpaceCommunicationUpdate,
  NotificationEventPayloadUserMessageDirect,
} from '@alkemio/notifications-lib';
import { User } from '@core/models';
import { MockWinstonProvider } from '@test/mocks';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload';
import { NotificationEmailPayloadBuilderService } from '@src/services/notification/notification.email.payload.builder.service';
import { NotificationTemplateBuilder } from './notification.templates.builder';

const TEMPLATES_DIR = path.resolve(__dirname, '../../email-templates');

const listFiles = (dir: string): string[] =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap(entry =>
      entry.isDirectory()
        ? listFiles(path.join(dir, entry.name))
        : [path.join(dir, entry.name)]
    );

// Every piece of markup a test payload carries is tagged with a "probe-" marker,
// so the assertions tell it apart from the layout's and the template's own markup.
const MARKED_MESSAGE = [
  '<img src=x onerror=alert(1) id="probe-img">',
  '[click](javascript:alert(1))',
  '<a href="javascript:alert(1)" id="probe-link">go</a>',
  '&lt;b id="probe-b"&gt;x&lt;/b&gt;',
  'Tom & Co <x>',
].join(' ');

const tagsOf = (html: string): string[] => html.match(/<[^>]*>/g) ?? [];

const expectNoMarkupFromPayload = (html: string): void => {
  const tags = tagsOf(html);
  expect(tags.filter(tag => tag.includes('probe-'))).toEqual([]);
  expect(tags.filter(tag => /onerror/i.test(tag))).toEqual([]);
  expect(tags.filter(tag => /=\s*["']?\s*javascript:/i.test(tag))).toEqual([]);
  expect(tags.filter(tag => /^<\/?x\b/i.test(tag))).toEqual([]);
};

const hrefOfLinkWithText = (html: string, text: string): string | undefined =>
  html.match(
    new RegExp(`<a\\b[^>]*href="([^"]*)"[^>]*>\\s*${text}\\s*</a>`)
  )?.[1];

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const PLATFORM_URL = 'https://platform.example.test';
const SPACE_URL = 'https://spaces.example.test/solaris';
const UPDATE_URL = 'https://updates.example.test/solaris/1';

const recipient: User = {
  id: 'recipient-1',
  firstName: 'Rita',
  lastName: 'Recipient',
  email: 'rita@example.com',
  profile: {
    displayName: 'Rita Recipient',
    url: 'https://users.example.test/rita',
  },
};

const recipientPayload = {
  id: 'recipient-1',
  firstName: 'Rita',
  lastName: 'Recipient',
  email: 'rita@example.com',
  type: 'USER',
  profile: {
    displayName: 'Rita Recipient',
    url: 'https://users.example.test/rita',
  },
};

const contributor = (id: string, firstName: string, displayName: string) => ({
  id,
  firstName,
  lastName: 'Example',
  email: `${id}@example.com`,
  type: 'USER',
  profile: { displayName, url: `https://users.example.test/${id}` },
});

describe('Mail templates encode the values they are given', () => {
  let templateBuilder: NotificationTemplateBuilder;
  const payloadBuilder = new NotificationEmailPayloadBuilderService({
    get: jest.fn().mockReturnValue({}),
  } as unknown as ConfigService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTemplateBuilder, MockWinstonProvider],
    }).compile();
    templateBuilder = module.get(NotificationTemplateBuilder);
  });

  const render = async (template: string, payload: BaseEmailPayload) => {
    const result = await templateBuilder.buildTemplate(template, payload);
    expect(result).toBeDefined();
    return {
      html: result?.channels?.email?.html ?? '',
      subject: result?.channels?.email?.subject ?? '',
      title: result?.title ?? '',
    };
  };

  it('no template, layout or shared block opts a value out of encoding', () => {
    const files = listFiles(TEMPLATES_DIR);
    expect(files.length).toBeGreaterThan(0);

    const optingOut = files
      .filter(file => {
        const source = fs.readFileSync(file, 'utf8');
        return /\|\s*safe\b/.test(source) || /{%-?\s*autoescape\b/.test(source);
      })
      .map(file => path.relative(TEMPLATES_DIR, file));

    expect(optingOut).toEqual([]);
  });

  describe('space update mail', () => {
    const updatePayload = (
      message: string
    ): NotificationEventPayloadSpaceCommunicationUpdate => ({
      eventType: 'SpaceCommunityUpdateSent',
      triggeredBy: contributor('sender-1', 'Sam', 'Sam Sender'),
      recipients: [recipientPayload],
      platform: { url: PLATFORM_URL },
      space: {
        id: 'space-1',
        level: '0',
        profile: { displayName: 'Solaris Lab', url: SPACE_URL },
        adminURL: `${SPACE_URL}/admin`,
      },
      update: {
        id: 'update-1',
        createdBy: contributor('sender-1', 'Sam', 'Sam Sender'),
        url: UPDATE_URL,
      },
      message,
    });

    const renderUpdate = (message: string) =>
      render(
        'space.communication.update.member',
        payloadBuilder.createEmailTemplatePayloadSpaceCommunicationUpdate(
          updatePayload(message),
          recipient
        )
      );

    const expectAnnouncementAndButtonToTheSpace = (html: string): void => {
      expect(html).toContain('<b>Sam</b> shared a new update in');
      expect(hrefOfLinkWithText(html, 'Solaris Lab')).toBe(SPACE_URL);
      expect(hrefOfLinkWithText(html, 'HAVE A LOOK!')).toBe(SPACE_URL);
    };

    it('renders markup in the update text as literal characters', async () => {
      const { html } = await renderUpdate(MARKED_MESSAGE);

      expectNoMarkupFromPayload(html);
      expect(html).toContain('Tom &amp; Co');
    });

    it('keeps the platform markup and the button that opens the space', async () => {
      const { html } = await renderUpdate(MARKED_MESSAGE);

      expect(html).toContain(
        'src="https://welcome.alkem.io/email/alkemio-logo.png"'
      );
      expectAnnouncementAndButtonToTheSpace(html);
      expect(html).not.toContain(UPDATE_URL);
    });

    it('shows formatted update text as its words, line by line, without the marks', async () => {
      const { html } = await renderUpdate(
        [
          '# Quillon Heading',
          '- Ravelin first',
          '- Sallyport second',
          '- Tenaille third',
          'Some **Umbonate bold** words',
          'Follow [Vexillum anchor](https://example.org/vexillum)',
        ].join('\n')
      );

      const lines = [
        'Quillon Heading',
        'Ravelin first',
        'Sallyport second',
        'Tenaille third',
        'Some Umbonate bold words',
        'Follow Vexillum anchor',
      ];
      expect(html).toMatch(
        new RegExp(lines.map(escapeRegExp).join('\\s*\\n\\s*'))
      );
    });

    it('still announces an update whose text is only an image', async () => {
      const { html } = await renderUpdate(
        '![probe-alt](https://example.org/probe-x.png)'
      );

      expectAnnouncementAndButtonToTheSpace(html);
      expectNoMarkupFromPayload(html);
    });
  });

  describe('message mails', () => {
    const SENDER_NAME = '<Sam> & "Co" <x>';
    const USER_NAME = '<Tom> & "Co" <x>';
    const ORGANIZATION_NAME = '<Acme> & "Co" <x>';
    const SPACE_NAME = '<Sol> & "Co" <x>';
    const ALL_NAMES = [SENDER_NAME, USER_NAME, ORGANIZATION_NAME, SPACE_NAME];

    const encode = (name: string): string =>
      name
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

    const sender = contributor('sender-1', 'Sam', SENDER_NAME);
    const base = {
      triggeredBy: sender,
      recipients: [recipientPayload],
      platform: { url: PLATFORM_URL },
      message: MARKED_MESSAGE,
    };
    const userMessage: NotificationEventPayloadUserMessageDirect = {
      ...base,
      eventType: 'UserMessageDirect',
      user: contributor('target-1', 'Tom', USER_NAME),
    };
    const organizationMessage: NotificationEventPayloadOrganizationMessageDirect =
      {
        ...base,
        eventType: 'OrganizationMessageDirect',
        organization: {
          id: 'org-1',
          type: 'ORGANIZATION',
          profile: {
            displayName: ORGANIZATION_NAME,
            url: 'https://organizations.example.test/acme',
          },
        },
      };
    const spaceMessage: NotificationEventPayloadSpaceCommunicationMessageDirect =
      {
        ...base,
        eventType: 'SpaceCommunicationMessage',
        space: {
          id: 'space-1',
          level: '0',
          profile: { displayName: SPACE_NAME, url: SPACE_URL },
          adminURL: `${SPACE_URL}/admin`,
        },
      };

    type Row = {
      template: string;
      payload: () => BaseEmailPayload;
      // The name the subject (and, unless titleText is given, the title) shows.
      plainTextName: string;
      titleText?: string;
      bodyNames: string[];
    };

    const rows: Row[] = [
      {
        template: 'user.message.recipient',
        payload: () =>
          payloadBuilder.createEmailTemplatePayloadUserMessage(
            userMessage,
            recipient
          ),
        plainTextName: SENDER_NAME,
        bodyNames: [SENDER_NAME],
      },
      {
        template: 'user.message.sender',
        payload: () =>
          payloadBuilder.createEmailTemplatePayloadUserMessageSender(
            userMessage,
            recipient
          ),
        plainTextName: USER_NAME,
        bodyNames: [USER_NAME],
      },
      {
        template: 'organization.message.recipient',
        payload: () =>
          payloadBuilder.createEmailTemplatePayloadOrganizationMessage(
            organizationMessage,
            recipient
          ),
        plainTextName: SENDER_NAME,
        bodyNames: [SENDER_NAME, ORGANIZATION_NAME],
      },
      {
        template: 'organization.message.sender',
        payload: () =>
          payloadBuilder.createEmailTemplatePayloadOrganizationMessageSender(
            organizationMessage,
            recipient
          ),
        plainTextName: ORGANIZATION_NAME,
        bodyNames: [ORGANIZATION_NAME],
      },
      {
        template: 'space.lead.communication.message.direct.receiver',
        payload: () =>
          payloadBuilder.createEmailTemplatePayloadSpaceCommunicationMessage(
            spaceMessage,
            recipient
          ),
        plainTextName: SENDER_NAME,
        bodyNames: [SENDER_NAME, SPACE_NAME],
      },
      {
        // The sender's copy reuses the space message payload: it reads the
        // space and the message from it.
        template: 'space.communication.message.direct.sender',
        payload: () =>
          payloadBuilder.createEmailTemplatePayloadSpaceCommunicationMessage(
            spaceMessage,
            recipient
          ),
        plainTextName: SPACE_NAME,
        titleText: 'You have sent a message to community!',
        bodyNames: [SPACE_NAME],
      },
    ];

    it.each(rows)(
      '$template shows the message markup as literal characters',
      async ({ template, payload }) => {
        const { html } = await render(template, payload());

        expectNoMarkupFromPayload(html);
        expect(html).toContain(
          '&lt;img src=x onerror=alert(1) id=&quot;probe-img&quot;&gt;'
        );
        expect(html).toContain(
          '&lt;a href=&quot;javascript:alert(1)&quot; id=&quot;probe-link&quot;&gt;go&lt;/a&gt;'
        );
        expect(html).toContain('&amp;lt;b id=&quot;probe-b&quot;&amp;gt;');
        expect(html).toContain('Tom &amp; Co &lt;x&gt;');
      }
    );

    it.each(rows)(
      '$template shows names encoded in the body and as typed in the subject and title',
      async ({ template, payload, plainTextName, titleText, bodyNames }) => {
        const { html, subject, title } = await render(template, payload());

        for (const name of bodyNames) {
          expect(html).toContain(encode(name));
        }
        for (const name of ALL_NAMES) {
          expect(html).not.toContain(name);
        }

        expect(subject).toContain(plainTextName);
        expect(subject).not.toMatch(/&(amp|lt|gt|quot|#)/);
        if (titleText) {
          expect(title).toBe(titleText);
        } else {
          expect(title).toContain(plainTextName);
          expect(title).not.toMatch(/&(amp|lt|gt|quot|#)/);
        }
      }
    );
  });
});
