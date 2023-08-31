import { Application } from 'express';
import { createServer } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';

import { createObjectFromCookies } from '../helpers';

import { t, changeLanguage } from 'i18next';

import { typeDefs, resolvers } from './schema';

import { GRAPHQL_ENDPOINT } from '../config';
import { InternalServerException } from './errors';

interface MyContext {
  token?: string;
}

export const handleContext = async ({ req: { headers } }) => {
  const i18nextCookies = headers.cookies ?? '';
  const cookies = createObjectFromCookies(i18nextCookies);

  const token = headers.authorization
    ? headers.authorization.split(' ')[1]
    : '';
  const currentLanguage = cookies.i18next || 'en';

  changeLanguage(currentLanguage);

  return { token, t };
};

export const applyApolloServer = async (app: Application) => {
  const httpServer = createServer(app);

  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (err) => {
      if (err.message.includes('Response')) {
        return new InternalServerException(t('common_error_internalServer'));
      }

      return err;
    },
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
