import { Application } from 'express';
import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';

// import { createCookies } from './helpers';
import { t } from 'i18next';

import { typeDefs, resolvers } from './schema';

import { GRAPHQL_ENDPOINT } from '../config';

interface MyContext {
  token?: string;
}

export const handleContext = async ({
  req: {
    headers,
    //  custom: {cookiesFallback },  cookies: { i18next }
  },
}) => {
  const token = headers.authorization
    ? headers.authorization.split(' ')[1]
    : '';

  // const cookies = createCookies(String(cookiesFallback));
  // const currentLanguage = /* i18next || */ cookies.i18next;
  // console.log('i18n', i18n.t);
  // i18next.changeLanguage(cookies?.i18next);

  return { token, t };
};

export const applyApolloServer = async (app: Application) => {
  const httpServer = createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    GRAPHQL_ENDPOINT,
    expressMiddleware(server, {
      context: handleContext,
    })
  );

  return { httpServer };
};
