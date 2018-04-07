import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { schema } from '../../schema';
import { setupTest, getContext } from '../../../test/helper';

import { User } from '../../model';
import { Pet } from '../../model';

beforeEach(async () => await setupTest());

it('should not allow anonymous user', async () => {
  // TODO: specify fields to create a new Pet
  const pet = new Pet({
    name: 'Teste',
    age: 19,
    animal: 'CAT',
    breed: 'Nojento',
  });

  await pet.save();

  const petId = toGlobalId('Pet', pet._id);

  const query = `
    mutation M {
      PetEdit(input: {
        id: "${petId}"
        example: "Example Field to Update"
      }) {
        pet {
          name
          age
          animal
          breed
        }
      }
    }
  `;

  const rootValue = {};
  // No user should be passed to context since we are testing an anonymous session
  const context = getContext();

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});

it('should edit a record on database', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
  });

  await user.save();

  // TODO: specify fields to create a new Pet
  const pet = new Pet({
    name: 'Example value',
    age: 20,
    animal: 'Example value',
    breed: 'Example value',
  });

  await pet.save();

  const petId = toGlobalId('Pet', pet._id);

  const query = `
    mutation M {
      PetEdit(input: {
        id: "${petId}"
        example: "Example Field to Update"
      }) {
        pet {
          name
          age
          animal
          breed
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});
