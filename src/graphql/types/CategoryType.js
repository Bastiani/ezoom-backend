import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLEnumType } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { sequelizeConnection } from 'graphql-sequelize';

import db from '../../models';

import { nodeInterface } from '../nodeInterface';

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  description: 'Category type definition',
  fields: () => ({
    id: globalIdField('Category'),
    title: {
      type: GraphQLString,
      description: 'Titulo of the category',
    },
  }),
  interfaces: () => [nodeInterface],
});

export const CategoryConnectionType = sequelizeConnection({
  name: 'CategoryConnection',
  nodeType: CategoryType,
  target: db.Category,
  connectionFields: {
    total: {
      type: GraphQLInt,
      resolve: ({ fullCount }) => fullCount || db.Category.count(),
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
    name: 'CategoryOrderBy',
    values: {
      ID: { value: ['id', 'ASC'] },
      XP: { value: ['xp', 'ASC'] },
    },
  }),
  where: (key, value, currentWhere) => {
    if (key === 'title') {
      return {
        name: { $like: `%${value}%` },
      };
    }

    return { [key]: value };
  },
});

export default CategoryType;
