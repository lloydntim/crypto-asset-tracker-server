import 'dotenv/config';

const {
  NODE_ENV,
  DEV_HOST,
  SERVER_PROD_URL,
  CLIENT_PROD_URL,
  CLIENT_DEV_PORT,
  MONGODB_DEV_URI,
  MONGODB_URI,
  PORT,
} = process.env;

const SERVER_DEV_URL = `http://${DEV_HOST}:${PORT}`;
const CLIENT_DEV_URL = `http://${DEV_HOST}:${CLIENT_DEV_PORT}`;

export const port = PORT;

export const domain =
  NODE_ENV === 'development' ? SERVER_DEV_URL : SERVER_PROD_URL;

export const clientUrl =
  NODE_ENV === 'development' ? CLIENT_DEV_URL : CLIENT_PROD_URL;

export const CMC_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';

export const mongoURI =
  NODE_ENV === 'development' ? MONGODB_DEV_URI : MONGODB_URI;

export const GRAPHQL_ENDPOINT = '/graphql';
export const mongoOptions = {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
};
