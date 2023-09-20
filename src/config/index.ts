import 'dotenv/config';

const {
  NODE_ENV,
  DEV_HOST,
  DOMAIN: PROD_DOMAIN,
  APOLLO_STUDIO_URL,
  CLIENT_DOMAIN,
  MONGODB_URI,
  PORT,
} = process.env;

const DEV_DOMAIN = `http://${DEV_HOST}:${PORT}`;

const DOMAIN = NODE_ENV === 'development' ? DEV_DOMAIN : PROD_DOMAIN;

const CMC_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';

const GRAPHQL_ENDPOINT = '/graphql';

export {
  GRAPHQL_ENDPOINT,
  MONGODB_URI,
  CMC_URL,
  CLIENT_DOMAIN,
  DOMAIN,
  PORT,
  APOLLO_STUDIO_URL,
};
