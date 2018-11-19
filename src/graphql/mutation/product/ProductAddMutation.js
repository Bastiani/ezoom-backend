import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import ProductType from '../../types/ProductType';

const mutation = mutationWithClientMutationId({
  name: 'ProductAdd',
  inputFields: {
    title: {
      type: GraphQLString,
    },
    text: {
      type: GraphQLString,
    },
    category: {
      type: GraphQLInt,
    },
  },
  mutateAndGetPayload: async (args, context) => {
    const { title, text, category } = args;

    let newProduct;
    await context.db.sequelize.transaction(async t => {
      newProduct = await context.db.Product.create({ title, text, category }, { transaction: t });
    });

    return {
      id: newProduct.id,
      error: null,
    };
  },
  outputFields: {
    product: {
      type: ProductType,
      resolve: async ({ id }, args, context) => {
        const newProduct = await context.db.Product.findById(id);

        if (!newProduct) {
          return null;
        }

        return newProduct;
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

export default mutation;
