import mongoose from 'mongoose';
import { mongoClientLogger } from './helpers/logger';

import { DOMAIN, MONGODB_URI, PORT } from './config';

import app from './app';
import { applyApolloServer } from './graphql';

const listen = async (port: string) => {
  const { httpServer } = await applyApolloServer(app);

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once('listening', resolve).once('error', reject);
  });
};

const main = async () => {
  try {
    await listen(PORT);

    mongoose.set('strictQuery', true);
    mongoose.connect(MONGODB_URI);

    mongoClientLogger.info(`🚀 Server is ready at ${DOMAIN}`);
  } catch (err) {
    mongoClientLogger.error('💀 Error starting the node server', err);
  }
};

main();
