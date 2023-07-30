import express from 'express';
import cors from 'cors';
import i18next from 'i18next';
import { handle } from 'i18next-http-middleware';

import { clientUrl } from './config';

import './i18n';

const app = express();

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(handle(i18next));

export default app;
