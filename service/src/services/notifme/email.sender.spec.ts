import { AddressInfo, createServer, Socket } from 'node:net';
import { createServer as createTlsServer } from 'node:tls';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { EmailSender, EmailRequest } from './email.sender';
import { notifmeSdkFactory } from './notifme.sdk.factory';

const certificate = readFileSync(
  path.resolve(__dirname, '../../../test/fixtures/smtp-self-signed.crt')
);
const key = readFileSync(
  path.resolve(__dirname, '../../../test/fixtures/smtp-self-signed.key')
);
const email: EmailRequest = {
  from: 'Sender <sender@example.test>',
  to: 'recipient@example.test',
  subject: 'A & B',
  html: '<p>Hello &amp; welcome</p>',
};
const logger = () => ({ log: jest.fn(), warn: jest.fn(), error: jest.fn() });

async function smtpFixture(
  options: { tls?: boolean; rejectMail?: boolean; rejectAuth?: boolean } = {}
) {
  const messages: string[] = [];
  const commands: string[] = [];
  const sockets = new Set<Socket>();
  const accept = (socket: Socket) => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => undefined);
    socket.write('220 fixture.example ESMTP\r\n');
    let buffer = '';
    let data = false;
    let message = '';
    socket.on('data', chunk => {
      buffer += chunk.toString();
      let end: number;
      while ((end = buffer.indexOf('\r\n')) >= 0) {
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (data) {
          if (line === '.') {
            messages.push(message);
            data = false;
            socket.write('250 accepted\r\n');
          } else {
            message += line + '\r\n';
          }
        } else {
          commands.push(line);
          if (line === 'DATA') {
            data = true;
            socket.write('354 send message\r\n');
          } else if (line.startsWith('EHLO')) {
            socket.write('250-fixture.example\r\n250 AUTH PLAIN\r\n');
          } else if (line.startsWith('AUTH PLAIN')) {
            const expected = Buffer.from('\0fixture\0synthetic').toString(
              'base64'
            );
            socket.write(
              options.rejectAuth || line !== `AUTH PLAIN ${expected}`
                ? '535 invalid credentials\r\n'
                : '235 authenticated\r\n'
            );
          } else if (line.startsWith('MAIL FROM') && options.rejectMail) {
            socket.write('550 synthetic mail rejection\r\n');
          } else if (line === 'QUIT') {
            socket.end('221 goodbye\r\n');
          } else {
            socket.write('250 OK\r\n');
          }
        }
      }
    });
  };
  const server = options.tls
    ? createTlsServer({ key, cert: certificate }, accept)
    : createServer(accept);
  server.on('tlsClientError', () => undefined);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  return {
    messages,
    commands,
    transport: {
      host: '127.0.0.1',
      port: (server.address() as AddressInfo).port,
      secure: options.tls ?? false,
      auth: { user: 'fixture', pass: 'synthetic' },
    },
    async close() {
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    },
  };
}

describe('email delivery', () => {
  it('preserves SMTP authentication, envelope, MIME fields and attachment bytes', async () => {
    const smtp = await smtpFixture();
    try {
      const sender = new EmailSender(smtp.transport, 'no-fallback', logger());
      const result = await sender.send({
        email: {
          ...email,
          cc: ['copy@example.test'],
          bcc: ['hidden@example.test'],
          replyTo: 'reply@example.test',
          text: 'plain body',
          headers: { 'X-Fixture': 'preserved' },
          attachments: [
            {
              filename: 'fixture.bin',
              contentType: 'application/octet-stream',
              content: Buffer.from('attachment bytes\n'),
            },
          ],
        },
      });
      expect(result).toEqual({
        status: 'success',
        channels: {
          email: { id: expect.any(String), providerId: 'email-smtp-provider' },
        },
      });
      expect(smtp.commands).toContain('MAIL FROM:<sender@example.test>');
      for (const address of [
        'recipient@example.test',
        'copy@example.test',
        'hidden@example.test',
      ]) {
        expect(smtp.commands).toContain(`RCPT TO:<${address}>`);
      }
      expect(smtp.commands).toContain(
        `AUTH PLAIN ${Buffer.from('\0fixture\0synthetic').toString('base64')}`
      );
      expect(smtp.messages).toHaveLength(1);
      for (const expected of [
        'Subject: A & B',
        'Reply-To: reply@example.test',
        'X-Fixture: preserved',
        'Content-Type: text/html',
        '<p>Hello &amp; welcome</p>',
        'plain body',
        'filename=fixture.bin',
        Buffer.from('attachment bytes\n').toString('base64'),
      ]) {
        expect(smtp.messages[0]).toContain(expected);
      }
    } finally {
      await smtp.close();
    }
  });

  it('keeps logger fallback success when the SMTP provider rejects mail', async () => {
    const smtp = await smtpFixture({ rejectMail: true });
    const logs = logger();
    const fullEmail: EmailRequest = {
      ...email,
      cc: ['copy@example.test', 'copy2@example.test'],
      bcc: ['hidden@example.test'],
      replyTo: 'reply@example.test',
      text: 'plain body',
      headers: { 'X-Fixture': 'header-value' },
      attachments: [
        {
          filename: 'fixture.bin',
          contentType: 'application/octet-stream',
          content: Buffer.from('attachment bytes\n'),
        },
      ],
    };
    try {
      const result = await new EmailSender(
        smtp.transport,
        'fallback',
        logs
      ).send({ email: fullEmail });
      expect(result.status).toBe('success');
      expect(result.channels?.email).toEqual({
        id: expect.stringMatching(/^id-\d+$/),
        providerId: 'email-logger-provider',
      });
      expect(logs.log).toHaveBeenCalledWith(
        '[EMAIL] Sent by "email-logger-provider": to=1 cc=2 bcc=1 attachments=1 bytes=53'
      );
      const logged = [logs.log, logs.warn, logs.error]
        .flatMap(fn => fn.mock.calls.flat())
        .map(arg => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
        .join('\n');
      for (const secret of [
        'sender@example.test',
        'recipient@example.test',
        'copy@example.test',
        'copy2@example.test',
        'hidden@example.test',
        'reply@example.test',
        'A & B',
        'Hello',
        'plain body',
        'header-value',
        'fixture.bin',
      ]) {
        expect(logged).not.toContain(secret);
      }
      expect(logs.warn).toHaveBeenCalled();
      expect(smtp.messages).toHaveLength(0);
    } finally {
      await smtp.close();
    }
  });

  it.each(['mail', 'auth'])(
    'returns status:error without fallback on %s rejection',
    async failure => {
      const smtp = await smtpFixture({
        rejectMail: failure === 'mail',
        rejectAuth: failure === 'auth',
      });
      const logs = logger();
      try {
        const result = await new EmailSender(
          smtp.transport,
          'no-fallback',
          logs
        ).send({ email });
        expect(result.status).toBe('error');
        expect(result.channels?.email.providerId).toBe('email-smtp-provider');
        expect(result.errors?.email).toMatch(/535|550/);
        expect(logs.log).not.toHaveBeenCalled();
        expect(smtp.messages).toHaveLength(0);
      } finally {
        await smtp.close();
      }
    }
  );

  it('preserves SMTP-first round robin and fallback after a logger failure', async () => {
    const smtp = await smtpFixture();
    const logs = logger();
    try {
      const sender = new EmailSender(smtp.transport, 'roundrobin', logs);
      const results = [];
      for (let i = 0; i < 3; i++) results.push(await sender.send({ email }));
      expect(results.map(result => result.channels?.email.providerId)).toEqual([
        'email-smtp-provider',
        'email-logger-provider',
        'email-smtp-provider',
      ]);
      expect(smtp.messages).toHaveLength(2);
      logs.log.mockImplementationOnce(() => {
        throw new Error('synthetic logger failure');
      });
      const fallback = await sender.send({ email });
      expect(fallback.channels?.email.providerId).toBe('email-smtp-provider');
      expect(smtp.messages).toHaveLength(3);
    } finally {
      await smtp.close();
    }
  });

  it('verifies a trusted TLS certificate and rejects an untrusted certificate', async () => {
    const smtp = await smtpFixture({ tls: true });
    try {
      const trusted = new EmailSender(
        {
          ...smtp.transport,
          tls: { ca: certificate, servername: 'localhost' },
        },
        'no-fallback',
        logger()
      );
      expect((await trusted.send({ email })).status).toBe('success');
      const untrusted = new EmailSender(
        { ...smtp.transport, tls: { rejectUnauthorized: true } },
        'no-fallback',
        logger()
      );
      const rejected = await untrusted.send({ email });
      expect(rejected.status).toBe('error');
      expect(rejected.errors?.email).toMatch(/self-signed|certificate/i);
      expect(smtp.messages).toHaveLength(1);
    } finally {
      await smtp.close();
    }
  });

  it('factory preserves configured TLS, authentication and provider strategy', async () => {
    const smtp = await smtpFixture({ tls: true });
    try {
      const configuration = {
        email: {
          smtp: { ...smtp.transport, tls: { rejectUnauthorized: false } },
          multi_provider_strategy: 'no-fallback',
        },
      };
      const sender = await notifmeSdkFactory(logger(), {
        get: () => configuration,
      } as unknown as ConfigService);
      expect((await sender!.send({ email })).status).toBe('success');
      expect(smtp.messages).toHaveLength(1);
    } finally {
      await smtp.close();
    }
  });

  it('factory retains startup failure for an invalid strategy', async () => {
    const logs = logger();
    const sender = await notifmeSdkFactory(logs, {
      get: () => ({ email: { multi_provider_strategy: 'invalid' } }),
    } as unknown as ConfigService);
    expect(sender).toBeUndefined();
    expect(logs.error).toHaveBeenCalled();
  });
});
