import express from 'express';
import cors, { CorsRequest } from 'cors';
import i18next from 'i18next';
import { handle } from 'i18next-http-middleware';
import { json } from 'body-parser';
import { clientUrl } from './config';

import 'dotenv/config';
import './i18n';

const app = express();

app.use(
  cors<CorsRequest>({
    origin: [clientUrl, process.env.APOLLO_STUDIO_URL],
    credentials: true,
  }),
  json(),
  handle(i18next)
);

export default app;
