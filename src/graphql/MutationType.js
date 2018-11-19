// @flow

import { GraphQLObjectType } from 'graphql';

import UserAddMutation from './mutation/user/UserAddMutation';
import UserLoginMutation from './mutation/user/UserLoginMutation';
import CategoryAddMutation from './mutation/category/CategoryAddMutation';
import ProductAddMutation from './mutation/product/ProductAddMutation';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // auth
    UserLoginMutation,
    UserAddMutation,
    CategoryAddMutation,
    ProductAddMutation,
  }),
});
