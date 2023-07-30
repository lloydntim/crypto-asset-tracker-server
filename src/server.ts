import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import i18next from 'i18next';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { createServer } from 'http';

import { domain, mongoConfig, mongoURI, port } from './config';
import { typeDefs, resolvers } from './graphql/schema';
import { getCurrentUser } from './middleware';
// import { createCookies } from './helpers';

import app from './app';

async function listen(port: string | number) {
  const httpServer = createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    context: ({
      req: {
        headers: {
          authorization,
        } /*, custom: cookiesFallback },  cookies: { i18next } */,
      },
      res,
    }) => {
      const token = authorization ? authorization?.split(' ')[1] : '';
      const currentUser = getCurrentUser(token);
      const { t } = i18next;
      // const cookies = createCookies(String(cookiesFallback));
      // const currentLanguage = /* i18next || */ cookies.i18next;
      // console.log('i18n', i18n.t);
      // i18next.changeLanguage(cookies?.i18next);
      return { currentUser, t };
      // return { t, currentUser, Sentry };
    },
    formatError: (error) => {
      console.log('Internal Error', error);
      // Sentry.captureException(error);
      throw new Error(error.message);
    },
  });

  await server.start();

  server.applyMiddleware({ app, path: '/graphql', cors: false });

  return new Promise((resolve, reject) => {
    httpServer.listen(port).once('listening', resolve).once('error', reject);
  });
}

const main = async () => {
  try {
    await listen(port);
    console.log(`🚀 Server is ready at ${domain}`);

    mongoose.connect(mongoURI, mongoConfig);
  } catch (err) {
    console.error('💀 Error starting the node server', err);
  }
};

main();
