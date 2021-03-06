// @flow
/* eslint-disable no-console */
import Koa from 'koa';
import Router from 'koa-router';
import graphqlHttp from 'koa-graphql';
import cors from 'koa-cors';
import convert from 'koa-convert';
import { print } from 'graphql/language';
import { koaPlayground } from 'graphql-playground-middleware';

import schema from './schema';
import { getUser } from './helper';
import { graphqlPort } from './config';
import db from './models';

const app = new Koa();
const router = new Router();

const graphqlSettingsPerReq = async req => {
  const { user } = await getUser(req.header.authorization);

  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    pretty: true,
    context: {
      req,
      db,
      user,
    },
    extensions: ({ document, variables, operationName, result }) => {
      console.log(print(document));
      console.log(variables);
      console.log(operationName, result);
    },
    formatError: error => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};
const graphqlServer = convert(graphqlHttp(graphqlSettingsPerReq));

app.use(cors());

router.all('/graphql', graphqlServer);
router.all(
  '/playground',
  koaPlayground({
    endpoint: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${graphqlPort}/subscriptions`,
  }),
);

app.use(router.routes()).use(router.allowedMethods());

export default app;
