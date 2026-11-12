import { Injectable } from '@nestjs/common';

/**
 * Whether this pod has a RabbitMQ consumer attached. Backs the readiness
 * probe (`/health/ready`), so a rollout only proceeds once the new pod is
 * actually consuming (infrastructure-operations#2634).
 *
 * `consuming` flips once, when `startAllMicroservices()` resolves — Nest calls
 * that back only after `channel.consume()` is registered. `connected` follows
 * the transport's status stream, which amqp-connection-manager drives through
 * every drop and reconnect.
 */
@Injectable()
export class AmqpConsumerState {
  private connected = false;
  private consuming = false;

  public setConnected(connected: boolean): void {
    this.connected = connected;
  }

  public markConsuming(): void {
    this.consuming = true;
  }

  public isReady(): boolean {
    return this.connected && this.consuming;
  }
}
