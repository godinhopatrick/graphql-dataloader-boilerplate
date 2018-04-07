import { graphql } from 'graphql';
import { schema } from '../../schema';
import { setupTest, getContext } from '../../../test/helper';

import { User } from '../../model';
import { Pet } from '../../model';

beforeEach(async () => await setupTest());

it('should not allow anonymous user', async () => {
  const query = `
    mutation M {
      PetAdd(input: {
        name: "Teste value"
        age: 20
        animal: "Cat"
        breed: "Nojento"
      }) {
        petEdge {
          node {
            name
            age
            animal
            breed
          }
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

it('should create a record on database', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
  });

  await user.save();

  const query = `
    mutation M {
      PetAdd(input: {
        name: "Example value"
        age: "Example value"
        animal: "Example value"
        breed: "Example value"
      }) {
        petEdge {
          node {
            name
            age
            animal
            breed
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ user });

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});
