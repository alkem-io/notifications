import { AlkemioClient } from '@alkemio/client-lib';
import {
  DEFAULT_ENDPOINTS,
  DEFAULT_SERVICE_ACCOUNT_CREDENTIALS,
} from '@src/common/constants/defaults';
import * as dotenv from 'dotenv';

const main = async () => {
  dotenv.config();

  const alkemioClient = new AlkemioClient({
    graphqlEndpoint:
      process.env.ALKEMIO_SERVER_ENDPOINT ?? DEFAULT_ENDPOINTS.alkemioServer,
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
