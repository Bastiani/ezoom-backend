import { GraphQLString, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import ProductType, { ProductConnectionType } from '../../types/ProductType';
import pubSub, { EVENTS } from '../../pubSub';

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

    await pubSub.publish(EVENTS.PRODUCT.ADDED, { ProductAdded: { newProduct } });

    return {
      id: newProduct.id,
      error: null,
    };
  },
  outputFields: {
    productEdge: {
      type: ProductConnectionType.edgeType,
      resolve: async ({ id }, args, context) => {
        const product = await context.db.Product.findById(id);
        // Returns null if no node was loaded
        if (!product) {
          return null;
        }
        return {
          cursor: toGlobalId('Product', product.id),
          node: product,
        };
      },
    },
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
