// @flow

import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import Pet from '../model/Pet';

import PetType from '../type/PetType';
import PetLoader from '../loader/PetLoader';

export default mutationWithClientMutationId({
  name: 'PetEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
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
  mutateAndGetPayload: async (args, context) => {
    const { user } = context;

    // Verify if user is authorized
    if (!user) {
      throw new Error('Unauthorized user');
    }

    const { id, name, age, animal, breed } = args;

    // Check if the provided ID is valid
    const pet = await Pet.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!pet) {
      throw new Error('Invalid petId');
    }

    // Edit record
    await pet.update({
      name,
      age,
      animal,
      breed,
    });

    // TODO: mutation logic

    // Clear dataloader cache
    PetLoader.clearCache(context, pet._id);

    return {
      id: pet._id,
      error: null,
    };
  },
  outputFields: {
    pet: {
      type: PetType,
      resolve: (obj, args, context) => PetLoader.load(context, obj.id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
