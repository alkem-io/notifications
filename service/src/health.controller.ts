import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AmqpConsumerState } from './amqp.consumer.state';

@Controller('/health')
export class HealthController {
  constructor(private readonly amqpConsumerState: AmqpConsumerState) {}

  // Liveness: the process answers at all. Deliberately checks nothing else —
  // a broker outage is not fixed by restarting this pod.
  @Get('/')
  public healthCheck(): string {
    return 'healthy!';
  }

  // Readiness: a RabbitMQ consumer is attached. The status is set on the
  // response rather than thrown: the global HttpExceptionsFilter catches
  // everything without writing a response, so a thrown 503 would leave the
  // probe hanging until its timeout.
  @Get('/ready')
  public readinessCheck(@Res({ passthrough: true }) res: Response): string {
    if (this.amqpConsumerState.isReady()) {
      return 'ready';
    }
    res.status(HttpStatus.SERVICE_UNAVAILABLE);
    return 'amqp consumer not attached';
  }
}
