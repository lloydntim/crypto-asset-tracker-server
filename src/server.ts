import mongoose from 'mongoose';

import { domain, mongoOptions, mongoURI, port } from './config';

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
    await listen(port);

    mongoose.set('strictQuery', true);
    mongoose.connect(mongoURI, mongoOptions);

    console.log(`🚀 Server is ready at ${domain}`);
  } catch (err) {
    console.error('💀 Error starting the node server', err);
  }
};

main();
