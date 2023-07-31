import express from 'express';
import cors from 'cors';
import i18next from 'i18next';
import { handle } from 'i18next-http-middleware';
import { json } from 'body-parser';

import { clientUrl } from './config';

import './i18n';

const app = express();

app.use(
  cors<cors.CorsRequest>({ origin: clientUrl, credentials: true }),
  json(),
  handle(i18next)
);

export default app;
