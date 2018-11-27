import { GraphQLObjectType } from 'graphql';
import { offsetToCursor } from 'graphql-relay';

import { ProductConnectionType } from '../../types/ProductType';
import pubSub, { EVENTS } from '../../pubSub';

const ProductAddedPayloadType = new GraphQLObjectType({
  name: 'ProductAddedPayload',
  fields: () => ({
    productEdge: {
      type: ProductConnectionType.edgeType,
      resolve: ({ newProduct }) => ({
        cursor: offsetToCursor(newProduct.id),
        node: newProduct,
      }),
    },
  }),
});
const productAdded = {
  type: ProductAddedPayloadType,
  subscribe: () => pubSub.asyncIterator(EVENTS.PRODUCT.ADDED),
};
export default productAdded;
