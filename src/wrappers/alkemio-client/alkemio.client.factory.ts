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
    const ctClient = new AlkemioClient({
      graphqlEndpoint: server,
    });
    ctClient.config.authInfo = {
      credentials: {
        email: configService.get(ConfigurationTypes.ALKEMIO)?.service_account
          ?.username,
        password: configService.get(ConfigurationTypes.ALKEMIO)?.service_account
          ?.password,
      },
      apiEndpointFactory: () => {
        return configService.get(ConfigurationTypes.KRATOS)?.public_endpoint;
      },
    };

    await ctClient.enableAuthentication();

    return ctClient;
  } catch (error) {
    logger.error(
      `Could not create Alkemio Client instance: ${error}`,
      LogContext.NOTIFICATIONS
    );
    return undefined;
  }
}
