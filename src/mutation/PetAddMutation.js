// @flow

import { GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import Pet from '../model/Pet';

import PetLoader from '../loader/PetLoader';
import PetConnection from '../connection/PetConnection';

import ViewerType from '../type/ViewerType';

export default mutationWithClientMutationId({
  name: 'PetAdd',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    age: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    animal: {
      type: GraphQLString,
    },
    breed: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args, { user }) => {
    // Verify if user is authorized
    if (!user) {
      throw new Error('Unauthorized user');
    }

    const { name, age, animal, breed } = args;

    // Create new record
    const pet = await new Pet({
      name,
      age,
      animal,
      breed,
    }).save();

    // TODO: mutation logic

    return {
      id: pet._id,
      error: null,
    };
  },
  outputFields: {
    petEdge: {
      type: PetConnection.edgeType,
      resolve: async ({ id }, args, context) => {
        // Load new edge from loader
        const pet = await PetLoader.load(context, id);

        // Returns null if no node was loaded
        if (!pet) {
          return null;
        }

        return {
          cursor: toGlobalId('Pet', pet),
          node: pet,
        };
      },
    },
    viewer: {
      type: ViewerType,
      resolve: async (obj, args, { user }) => user,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
