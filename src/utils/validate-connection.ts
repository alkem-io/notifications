import { AlkemioClient } from '@alkemio/client-lib';
import * as dotenv from 'dotenv';

const main = async () => {
  dotenv.config();

  const ctClient = new AlkemioClient({
    graphqlEndpoint:
      process.env.ALKEMIO_SERVER_ENDPOINT ??
      'http://localhost:3000/admin/graphql',
    authInfo: {
      credentials: {
        email: process.env.SERVICE_ACCOUNT_USERNAME ?? 'admin@alkem.io',
        password: process.env.SERVICE_ACCOUNT_PASSWORD ?? 'obichamazis',
      },
      kratosPublicApiEndpoint:
        process.env.KRATOS_API_PUBLIC_ENDPOINT ??
        'http://localhost:3000/identity/ory/kratos/public',
    },
  });

  console.log(`Client config: ${JSON.stringify(ctClient.config)}`);
  await ctClient.enableAuthentication();

  console.log(`API Token: ${ctClient.apiToken}`);

  const serverVersion = await ctClient.validateConnection();
  console.log(`Alkemio platform version: ${serverVersion}`);

  const hubID = 'Test';
  const hubExists = await ctClient.hubExists(hubID);
  console.log(`Hub '${hubID}' exists: ${hubExists}`);
};

try {
  main();
} catch (error) {
  console.error(error);
}
