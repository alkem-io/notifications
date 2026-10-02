import { Test, TestingModule } from '@nestjs/testing';
import { MockWinstonProvider } from '@test/mocks';
import { NotificationTemplateBuilder } from './notification.templates.builder';
import { BaseEmailPayload } from '@src/services/notification/email-template-payload';

describe('NotificationTemplateBuilder', () => {
  let builder: NotificationTemplateBuilder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTemplateBuilder, MockWinstonProvider],
    }).compile();

    builder = module.get(NotificationTemplateBuilder);
  });

  // Payload shaped for user.space.community.joined — space.displayName carries
  // every HTML-escapable character, which must survive verbatim in the
  // plain-text subject/title.
  const DISPLAY_NAME = 'A & B < C > D \'E" F';
  const ESCAPED_DISPLAY_NAME = 'A &amp; B &lt; C &gt; D &#39;E&quot; F';
  const payloadWithEntities = {
    recipient: {
      firstName: 'Al',
      email: 'al@example.com',
    },
    space: {
      displayName: DISPLAY_NAME,
      url: 'https://alkemio.test/spaces/this-and-that',
    },
  } as unknown as BaseEmailPayload;

  it('does not HTML-escape the email subject (plain-text field)', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithEntities
    );

    expect(result?.channels?.email?.subject).toContain(DISPLAY_NAME);
    expect(result?.channels?.email?.subject).not.toContain(
      ESCAPED_DISPLAY_NAME
    );
  });

  it('does not HTML-escape the notification title (plain-text field)', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithEntities
    );

    expect(result?.title).toContain(DISPLAY_NAME);
    expect(result?.title).not.toContain(ESCAPED_DISPLAY_NAME);
  });

  it('still HTML-escapes display names in the email body (injection safety)', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithEntities
    );

    expect(result?.channels?.email?.html).toContain(ESCAPED_DISPLAY_NAME);
    expect(result?.channels?.email?.html).not.toContain(DISPLAY_NAME);
  });

  it('returns undefined for an unknown template', async () => {
    const result = await builder.buildTemplate(
      'does.not.exist',
      payloadWithEntities
    );

    expect(result).toBeUndefined();
  });

  it('renders the canonical footer identity in the email body', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithEntities
    );
    const html = result?.channels?.email?.html;

    expect(html).toContain(
      'Alkemio is a European digital platform for collaboration in the spaces between organisations.'
    );
    expect(html).toContain('Designed for trust and resilience.');
    expect(html).toContain('href="https://github.com/alkem-io"');
    expect(html).toContain('href="https://www.linkedin.com/company/alkemio"');
    expect(html).toContain(
      'src="https://welcome.alkem.io/email/icon-github.png"'
    );
    expect(html).toContain(
      'src="https://welcome.alkem.io/email/icon-linkedin.png"'
    );

    expect(html).not.toContain('Safe Spaces for Collaboration');
    expect(html).not.toContain('PURPOSE DRIVEN');
    expect(html).not.toContain('githubassets.com');
    expect(html).not.toContain('content.linkedin.com');
    expect(html).not.toContain('alkemio-foundation');
    expect(html).not.toContain('alt="174857"');
    expect(html).not.toContain('alt="2048px');
  });

  it('rejects template names that traverse outside the templates folder', async () => {
    const result = await builder.buildTemplate(
      '../../config/some-secret',
      payloadWithEntities
    );

    expect(result).toBeUndefined();
  });
});
