// @flow

import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { NodeInterface } from '../interface/NodeInterface';

export default new GraphQLObjectType({
  name: 'Pet',
  description: 'Represents Pet',
  fields: () => ({
    id: globalIdField('Pet'),
    name: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.name,
    },
    age: {
      type: GraphQLInt,
      description: '',
      resolve: obj => obj.age,
    },
    animal: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.animal,
    },
    breed: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.breed,
    },
    createdAt: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.createdAt.toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.updatedAt.toISOString(),
    },
  }),
  interfaces: () => [NodeInterface],
});
