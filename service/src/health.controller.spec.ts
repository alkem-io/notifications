import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AmqpConsumerState } from './amqp.consumer.state';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let state: AmqpConsumerState;
  let controller: HealthController;
  let res: Response;

  beforeEach(() => {
    state = new AmqpConsumerState();
    controller = new HealthController(state);
    res = { status: jest.fn() } as unknown as Response;
  });

  it('liveness answers regardless of the AMQP state', () => {
    expect(controller.healthCheck()).toBe('healthy!');
  });

  it('is not ready before the consumer is registered', () => {
    state.setConnected(true);

    controller.readinessCheck(res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
  });

  it('is ready once connected and consuming', () => {
    state.setConnected(true);
    state.markConsuming();

    expect(controller.readinessCheck(res)).toBe('ready');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('drops out of readiness while disconnected and recovers on reconnect', () => {
    state.setConnected(true);
    state.markConsuming();

    state.setConnected(false);
    controller.readinessCheck(res);
    expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);

    state.setConnected(true);
    expect(controller.readinessCheck(res)).toBe('ready');
  });
});
