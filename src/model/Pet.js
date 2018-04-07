// @flow

import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    animal: {
      type: String,
      default: 'DOG',
    },
    breed: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'pet',
  },
);

export default mongoose.model('Pet', Schema);
