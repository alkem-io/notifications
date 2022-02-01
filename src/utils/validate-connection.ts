import { AlkemioClient } from '@alkemio/client-lib';
import {
  DEFAULT_ENDPOINTS,
  DEFAULT_SERVICE_ACCOUNT_CREDENTIALS,
} from '@src/common/constants/defaults';
import * as dotenv from 'dotenv';

const main = async () => {
  dotenv.config();
  const server =
    process.env.API_ENDPOINT_PRIVATE_GRAPHQL || DEFAULT_ENDPOINTS.alkemioServer;
  const alkemioClient = new AlkemioClient({
    apiEndpointPrivateGraphql: server,
    authInfo: {
      credentials: {
        email:
          process.env.SERVICE_ACCOUNT_USERNAME ??
          DEFAULT_SERVICE_ACCOUNT_CREDENTIALS.email,
        password:
          process.env.SERVICE_ACCOUNT_PASSWORD ??
          DEFAULT_SERVICE_ACCOUNT_CREDENTIALS.password,
      },
      kratosPublicApiEndpoint:
        process.env.KRATOS_API_PUBLIC_ENDPOINT ??
        DEFAULT_ENDPOINTS.kratosApiEndpoint,
    },
  });

  console.log(`Client config: ${JSON.stringify(alkemioClient.config)}`);
  await alkemioClient.enableAuthentication();

  console.log(`API Token: ${alkemioClient.apiToken}`);

  const serverVersion = await alkemioClient.validateConnection();
  console.log(`Alkemio platform version: ${serverVersion}`);

  const hubID = 'Test';
  const hubExists = await alkemioClient.hubExists(hubID);
  console.log(`Hub '${hubID}' exists: ${hubExists}`);
};

try {
  main();
} catch (error) {
  console.error(error);
}
