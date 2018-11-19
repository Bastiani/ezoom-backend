import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import CategoryType from '../../types/CategoryType';

const mutation = mutationWithClientMutationId({
  name: 'CategoryAdd',
  inputFields: {
    title: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { title } = args;

    let newCategory;
    await context.db.sequelize.transaction(async t => {
      newCategory = await context.db.Category.create({ title }, { transaction: t });
    });

    return {
      id: newCategory.id,
      error: null,
    };
  },
  outputFields: {
    category: {
      type: CategoryType,
      resolve: async ({ id }, args, context) => {
        const newCategory = await context.db.Category.findById(id);

        if (!newCategory) {
          return null;
        }

        return newCategory;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
