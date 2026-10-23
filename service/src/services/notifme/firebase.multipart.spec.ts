/* eslint-disable @typescript-eslint/no-require-imports */
import { createServer } from 'node:http';
import { AddressInfo } from 'node:net';
import path from 'node:path';

describe('Firebase multipart HTTP consumer', () => {
  it('preserves multipart response bytes with the patched parser', async () => {
    const { HttpClient } = require(
      path.join(
        path.dirname(require.resolve('firebase-admin')),
        'utils/api-request.js'
      )
    );
    const first =
      'Content-Type: application/http\r\n\r\nHTTP/1.1 200 OK\r\n\r\n{"name":"synthetic-message"}';
    const second =
      'Content-Type: application/http\r\n\r\nHTTP/1.1 400 Bad Request\r\n\r\n{"error":"synthetic-rejection"}';
    const server = createServer((_request, response) => {
      response.writeHead(200, {
        'content-type': 'multipart/mixed; boundary=fixture-boundary',
      });
      response.end(
        `--fixture-boundary\r\n${first}\r\n--fixture-boundary\r\n${second}\r\n--fixture-boundary--\r\n`
      );
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    try {
      const response = await new HttpClient().send({
        method: 'GET',
        url: `http://127.0.0.1:${(server.address() as AddressInfo).port}/batch`,
      });
      expect(response.status).toBe(200);
      expect(response.multipart.map((part: Buffer) => part.toString())).toEqual(
        [
          first.split('\r\n\r\n').slice(1).join('\r\n\r\n'),
          second.split('\r\n\r\n').slice(1).join('\r\n\r\n'),
        ]
      );
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    }
  });
});
