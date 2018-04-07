// @flow

import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
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
    enum: ['CAT', 'DOG'],
    default: 'DOG',
  },
  breed: {
    type: String,
  },
});

export default mongoose.model('Pet', Schema);
