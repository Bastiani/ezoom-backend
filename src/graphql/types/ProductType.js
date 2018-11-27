import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLEnumType } from 'graphql';
import { globalIdField, fromGlobalId } from 'graphql-relay';
import { sequelizeConnection } from 'graphql-sequelize';

import db from '../../models';

import { nodeInterface } from '../nodeInterface';

import CategoryType from './CategoryType';

const ProductType = new GraphQLObjectType({
  name: 'Product',
  description: 'Product type definition',
  fields: () => ({
    id: globalIdField('Product'),
    title: {
      type: GraphQLString,
      description: 'Titulo of the product',
    },
    text: {
      type: GraphQLString,
      description: 'Text of the product',
    },
    category: {
      type: CategoryType,
      resolve: async (obj, args, context) => await context.db.Category.findById(obj.category),
    },
  }),
  interfaces: () => [nodeInterface],
});

export const ProductConnectionType = sequelizeConnection({
  name: 'ProductConnection',
  nodeType: ProductType,
  target: db.Product,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ fullCount }) => fullCount || db.Product.count(),
    },
  },
  edgeFields: {
    index: {
      type: GraphQLInt,
      resolve: edge => new Buffer(edge.cursor, 'base64')
        .toString('ascii')
        .split('$')
        .pop(),
    },
  },
  orderBy: new GraphQLEnumType({
    name: 'ProductOrderBy',
    values: {
      ID: { value: ['id', 'ASC'] },
      XP: { value: ['xp', 'ASC'] },
    },
  }),
  where: (key, value, currentWhere) => {
    if (key === 'category') {
      return {
        category: fromGlobalId(value).id,
      };
    }

    return { [key]: value };
  },
});

export default ProductType;
