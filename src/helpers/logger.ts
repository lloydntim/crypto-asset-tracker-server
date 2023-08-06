import { createLogger, format, transports } from 'winston';

import 'dotenv/config';

const { LOG_LEVEL } = process.env;

const { colorize, combine, timestamp, json } = format;

const logger = createLogger({
  level: LOG_LEVEL || 'info',
  format: combine(json(), colorize(), timestamp()),

  transports: [new transports.Console()],
});

export const appolloServiceLogger = logger.child({ service: 'apollo' });
export const fetchHTMLServiceLogger = logger.child({ service: 'fetch-html' });
export const cmcServiceLogger = logger.child({ service: 'coin-market-cap' });
export const mongoClientLogger = logger.child({ service: 'mongo' });

export default logger;
