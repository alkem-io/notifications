import { Module } from '@nestjs/common';
import { AlkemioClientAdapterModule } from '@src/services';
import { InAppNotificationBuilder } from './in.app.notification.builder';

@Module({
  imports: [AlkemioClientAdapterModule],
  providers: [InAppNotificationBuilder],
  exports: [InAppNotificationBuilder],
})
export class InAppNotificationBuilderModule {}
