import { AddressInfo, createServer, Socket } from 'node:net';
import NotifmeSdk from 'notifme-sdk';

describe('notifme SMTP delivery', () => {
  it('delivers the envelope, subject and HTML through the SMTP provider', async () => {
    const messages: string[] = [];
    const commands: string[] = [];
    const sockets = new Set<Socket>();
    const server = createServer(socket => {
      sockets.add(socket);
      socket.on('close', () => sockets.delete(socket));
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
              socket.write('235 authenticated\r\n');
            } else if (line === 'QUIT') {
              socket.end('221 goodbye\r\n');
            } else {
              socket.write('250 OK\r\n');
            }
          }
        }
      });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    try {
      const sdk = new NotifmeSdk({
        channels: {
          email: {
            providers: [
              {
                type: 'smtp',
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port as 1025,
                secure: false,
                auth: { user: 'fixture', pass: 'synthetic' },
              },
            ],
          },
        },
      });
      const result = await sdk.send({
        email: {
          from: 'sender@example.test',
          to: 'recipient@example.test',
          subject: 'A & B',
          html: '<p>Hello &amp; welcome</p>',
        },
      });
      expect(result.status).toBe('success');
      expect(commands).toContain('MAIL FROM:<sender@example.test>');
      expect(commands).toContain('RCPT TO:<recipient@example.test>');
      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain('Subject: A & B');
      expect(messages[0]).toContain('Content-Type: text/html');
      expect(messages[0]).toContain('<p>Hello &amp; welcome</p>');
    } finally {
      for (const socket of sockets) socket.destroy();
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    }
  });
});
