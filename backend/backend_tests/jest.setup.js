import { jest } from '@jest/globals';
import mongoose from 'mongoose';

jest.setTimeout(10000);

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
  }

  await new Promise(resolve => setTimeout(resolve, 500));
});

afterEach(() => {
  jest.clearAllMocks();
});