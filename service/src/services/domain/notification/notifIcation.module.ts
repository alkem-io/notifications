import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { NotificationEmailPayloadBuilderService } from './notification.email.payload.builder.service';
import { NotificationService } from './notification.service';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [NotificationService, NotificationEmailPayloadBuilderService],
  exports: [NotificationService, NotificationEmailPayloadBuilderService],
})
export class NotificationModule {}
