import { GraphQLSchema } from 'graphql';

import Query from './graphql/QueryType';
import Mutation from './graphql/MutationType';
import Subscription from './graphql/SubscriptionType';

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription,
});

export default schema;
