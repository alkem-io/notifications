import { AlkemioClient } from '@alkemio/client-lib';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@src/common';

export async function alkemioClientFactory(
  logger: LoggerService,
  configService: ConfigService
): Promise<AlkemioClient | undefined> {
  try {
    const server = configService.get(ConfigurationTypes.ALKEMIO)?.endpoint;
    const alkemioClientConfig = {
      graphqlEndpoint: server,
      authInfo: {
        credentials: {
          email: configService.get(ConfigurationTypes.ALKEMIO)?.service_account
            ?.username,
          password: configService.get(ConfigurationTypes.ALKEMIO)
            ?.service_account?.password,
        },
        apiEndpointFactory: () => {
          return configService.get(ConfigurationTypes.KRATOS)?.public_endpoint;
        },
      },
    };
    logger.verbose?.('Alkemio client config:', LogContext.NOTIFICATIONS);
    logger.verbose?.(alkemioClientConfig, LogContext.NOTIFICATIONS);
    const alkemioClient = new AlkemioClient(alkemioClientConfig);

    await alkemioClient.enableAuthentication();

    return alkemioClient;
  } catch (error) {
    logger.error(
      `Could not create Alkemio Client instance: ${error}`,
      LogContext.NOTIFICATIONS
    );
    return undefined;
  }
}
