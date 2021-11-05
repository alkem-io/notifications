import { AlkemioClient, AuthInfo } from '@alkemio/client-lib';
import * as dotenv from 'dotenv';

const main = async () => {
  dotenv.config();

  const ctClient = new AlkemioClient({
    graphqlEndpoint:
      process.env.ALKEMIO_SERVER_ENDPOINT ??
      'http://localhost:3000/admin/graphql',
  });

  ctClient.config.authInfo = await getAuthInfo();
  console.log(ctClient);
  await ctClient.enableAuthentication();

  const serverVersion = await ctClient.validateConnection();
  console.log(`Alkemio platform version: ${serverVersion}`);

  const hubID = 'Test';
  const hubExists = await ctClient.hubExists(hubID);
  console.log(`Hub '${hubID}' exists: ${hubExists}`);
};

async function getAuthInfo(): Promise<AuthInfo | undefined> {
  return {
    credentials: {
      email: process.env.SERVICE_ACCOUNT_USERNAME ?? 'admin@alkem.io',
      password: process.env.SERVICE_ACCOUNT_PASSWORD ?? '!Rn5Ez5FuuyUNc!',
    },
    apiEndpointFactory: () => {
      return (
        process.env.KRATOS_API_PUBLIC_ENDPOINT ??
        'http://localhost:3000/identity/ory/kratos/public/'
      );
    },
  };
}

try {
  main();
} catch (error) {
  console.error(error);
}
