// @flow
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLID } from 'graphql';
import { resolver } from 'graphql-sequelize';
import { fromGlobalId } from 'graphql-relay';

import UserType, { UserConnectionType } from './types/UserType';
import CategoryType, { CategoryConnectionType } from './types/CategoryType';
import ProductType, { ProductConnectionType } from './types/ProductType';

import { nodeField } from './nodeInterface';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  node: nodeField,
  fields: () => ({
    me: {
      type: UserType,
      description: 'Me is the logged user',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: resolver((obj, args, context) => context.db.User, {}),
    },
    users: {
      type: UserConnectionType.connectionType,
      args: UserConnectionType.connectionArgs,
      resolve: (source, args, context, info) => {
        const { user } = context;
        if (!user) throw new Error('Unauthorized user');

        return UserConnectionType.resolve(source, args, context, info);
      },
    },
    category: {
      type: CategoryType,
      description: 'Category',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (obj, { id }, { db: { Category } }) => Category.findById(fromGlobalId(id).id),
      //resolver((obj, args, context) => context.db.Category, {}),
    },
    categories: {
      type: CategoryConnectionType.connectionType,
      args: CategoryConnectionType.connectionArgs,
      resolve: CategoryConnectionType.resolve,
    },
    product: {
      type: ProductType,
      description: 'Product',
      args: {
        id: {
          type: GraphQLNonNull(GraphQLID),
        },
      },
      resolve: resolver((obj, args, context) => context.db.Product, {}),
    },
    products: {
      type: ProductConnectionType.connectionType,
      args: {
        ...ProductConnectionType.connectionArgs,
        category: {
          description: 'id of the category',
          type: GraphQLID,
        },
      },
      resolve: (obj, args, context, info) => {
        const { user } = context;
        if (!user) throw new Error('Unauthorized user');

        return ProductConnectionType.resolve(obj, args, context, info);
      },
    },
  }),
});
