import { graphql } from 'graphql';
import { schema } from '../../schema';
import { getContext, setupTest } from '../../../test/helper';
import { Pet } from '../../model';

beforeEach(async () => await setupTest());

it('should retrieve a record', async () => {
  const pet = await new Pet({
    name: 'Theo',
    animal: 'DOG',
    breed: 'Labrathor',
    age: 2,
  }).save();

  // TODO: query to return a record
  const query = `
    query Q {
      pets(first: 1) {
        edges {
          node {
            name
            breed
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({ pet });

  const { errors, data } = await graphql(schema, query, rootValue, context);
  const { edges } = data.pets;
  expect(edges[0].node.name).toBe(pet.name);
});
