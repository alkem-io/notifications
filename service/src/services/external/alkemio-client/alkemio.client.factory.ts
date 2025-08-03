import { GraphQLClient } from 'graphql-request';
import { AlkemioClient } from '@alkemio/client-lib';
import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationTypes, LogContext } from '@common/enums';
import { getSdk, Sdk } from '@src/generated/graphql';

export async function alkemioClientFactory(
  logger: LoggerService,
  configService: ConfigService
): Promise<Sdk | undefined> {
  try {
    const server = configService.get(ConfigurationTypes.ALKEMIO)?.endpoint;
    const kratosApiEndpoint = configService.get(
      ConfigurationTypes.KRATOS
    )?.public_endpoint;

    const alkemioClientConfig = {
      apiEndpointPrivateGraphql: server,
      authInfo: {
        credentials: {
          email: configService.get(ConfigurationTypes.ALKEMIO)?.service_account
            ?.username,
          password: configService.get(ConfigurationTypes.ALKEMIO)
            ?.service_account?.password,
        },
        kratosPublicApiEndpoint: kratosApiEndpoint,
      },
    };
    logger.verbose?.(
      `Alkemio client config: ${JSON.stringify(alkemioClientConfig)}`,
      LogContext.NOTIFICATIONS
    );
    const alkemioClient = new AlkemioClient(alkemioClientConfig);

    await alkemioClient.enableAuthentication();
    const apiToken = alkemioClient.apiToken;

    const client = new GraphQLClient(
      alkemioClientConfig.apiEndpointPrivateGraphql,
      {
        headers: {
          authorization: `Bearer ${apiToken}`,
        },
      }
    );
    return getSdk(client);
  } catch (error) {
    logger.error(
      `Could not create Graphql SDK using Alkemio Client instance: ${error}`,
      LogContext.NOTIFICATIONS
    );
    return undefined;
  }
}
