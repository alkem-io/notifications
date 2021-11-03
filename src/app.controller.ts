import { Controller, Inject, LoggerService } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ALKEMIO_CLIENT_ADAPTER } from './common';
import { NotificationService } from '@src/services';
import { IFeatureFlagProvider } from '@core/contracts';

@Controller()
export class AppController {
  constructor(
    private notificationService: NotificationService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(ALKEMIO_CLIENT_ADAPTER)
    private readonly featureFlagProvider: IFeatureFlagProvider
  ) {
    this.notificationService
      .sendApplicationNotifications({
        applicationCreatorID: '1311b6a5-93ec-418c-ad87-4bbbd6cb6b76',
        applicantID: '1311b6a5-93ec-418c-ad87-4bbbd6cb6b76',
        community: {
          name: '02 Zero Hunger',
          type: 'challenge',
        },
        hub: {
          id: '32818605-ef2f-4395-bb49-1dc2835c23de',
          challenge: {
            id: '7b86f954-d8c3-4fac-a652-b922c80e5c20',
            opportunity: {
              id: '636be60f-b64a-4742-8b50-69e608601935',
            },
          },
        },
      })
      .then(console.log, console.warn)
      .catch(console.error);
  }

  @EventPattern('communityApplicationCreated')
  async sendApplicationNotification(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    if (!(await this.featureFlagProvider.areNotificationsEnabled())) {
      //toDo make this nack
      channel.ack(originalMsg);
    }

    this.notificationService
      .sendApplicationNotifications(data)
      .then(
        () => channel.ack(originalMsg),
        () => {
          /* a notification was rejected */
        }
      )
      .catch(err => {
        this.logger.error(err);
        // toDo check how to reject a message
        // channel.reject(originalMsg);
      });
  }
}
