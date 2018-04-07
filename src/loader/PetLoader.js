// @flow

import DataLoader from 'dataloader';
import PetModel from '../model/Pet';
import connectionFromMongoCursor from './ConnectionFromMongoCursor';
import mongooseLoader from './mongooseLoader';

type PetType = {
  id: string,
  _id: string,
  name: string,
  age: number,
  animal: string,
  breed: string,
  createdAt: string,
  updatedAt: string,
};

export default class Pet {
  id: string;
  _id: string;
  name: string;
  age: number;
  animal: string;
  breed: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: PetType) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.age = data.age;
    this.animal = data.animal;
    this.breed = data.breed;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(PetModel, ids));

const viewerCanSee = (viewer, data) => {
  // TODO: handle security
  return true;
};

export const load = async ({ user: viewer, dataloaders }, id) => {
  if (!id) return null;

  const data = await dataloaders.PetLoader.load(id.toString());

  if (!data) return null;

  return viewerCanSee(viewer, data) ? new Pet(data) : null;
};

export const clearCache = ({ dataloaders }, id) => {
  return dataloaders.PetLoader.clear(id.toString());
};

export const loadPets = async (context, args) => {
  // TODO: specify conditions
  const pets = PetModel.find({});

  return connectionFromMongoCursor({
    cursor: pets,
    context,
    args,
    loader: load,
  });
};
