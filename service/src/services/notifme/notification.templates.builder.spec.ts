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

  // Payload shaped for user.space.community.joined — space.displayName carries an
  // ampersand, which must survive verbatim in the plain-text subject/title.
  const payloadWithAmpersand = {
    recipient: {
      firstName: 'Al',
      email: 'al@example.com',
    },
    space: {
      displayName: 'This & That',
      url: 'https://alkemio.test/spaces/this-and-that',
    },
  } as unknown as BaseEmailPayload;

  it('does not HTML-escape the email subject (plain-text field)', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithAmpersand
    );

    expect(result?.channels?.email?.subject).toBe(
      'This & That - Welcome to the Community!'
    );
  });

  it('does not HTML-escape the notification title (plain-text field)', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithAmpersand
    );

    expect(result?.title).toBe('This & That - You have joined this community');
  });

  it('still HTML-escapes display names in the email body (injection safety)', async () => {
    const result = await builder.buildTemplate(
      'user.space.community.joined',
      payloadWithAmpersand
    );

    expect(result?.channels?.email?.html).toContain('This &amp; That');
    expect(result?.channels?.email?.html).not.toContain('This & That');
  });

  it('returns undefined for an unknown template', async () => {
    const result = await builder.buildTemplate(
      'does.not.exist',
      payloadWithAmpersand
    );

    expect(result).toBeUndefined();
  });
});
