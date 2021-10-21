import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, LoggerService, Module } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  ALKEMIO_CLIENT_PROVIDER,
  ConfigurationTypes,
  LogContext,
} from '@common/enums';
import { AlkemioClient } from '@alkemio/client-lib';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ALKEMIO_CLIENT_PROVIDER,
      useFactory: async (
        logger: LoggerService,
        configService: ConfigService
      ) => {
        try {
          const server = configService.get(
            ConfigurationTypes.ALKEMIO
          )?.endpoint;
          const ctClient = new AlkemioClient({
            graphqlEndpoint: server,
          });
          ctClient.config.authInfo = {
            credentials: {
              email: configService.get(ConfigurationTypes.ALKEMIO)
                ?.service_account?.username,
              password: configService.get(ConfigurationTypes.ALKEMIO)
                ?.service_account?.password,
            },
            apiEndpointFactory: () => {
              return configService.get(ConfigurationTypes.KRATOS)
                ?.public_endpoint;
            },
          };

          await ctClient.enableAuthentication();

          return ctClient;
        } catch (error) {
          logger.error(
            `Could not create Alkemio Client instance: ${error}`,
            LogContext.NOTIFICATIONS
          );
        }
      },
      inject: [WINSTON_MODULE_NEST_PROVIDER, ConfigService],
    },
  ],
  exports: [ALKEMIO_CLIENT_PROVIDER],
})
export class AlkemioClientModule {}
