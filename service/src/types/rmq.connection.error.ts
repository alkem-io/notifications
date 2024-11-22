export class RMQConnectionError {
  err!: {
    stack: string;
    message: string;
  };
  url!: {
    protocol: string;
    hostname: string;
    username: string;
    password: string;
    port: number;
    heartbeat: number;
  };
}
