import mongoose from 'mongoose';
import { jest } from '@jest/globals';

jest.setTimeout(15000000);

// Partial mocking of mongoose connection methods
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose'); // Import actual Mongoose for named exports
  return {
    ...originalMongoose, // Spread all original exports (like Schema, model, etc.)
    connect: jest.fn().mockResolvedValue(() => Promise.resolve()),
    disconnect: jest.fn().mockResolvedValue(() => Promise.resolve()),
    connection: {
      ...originalMongoose.connection, // Preserve original connection properties
      close: jest.fn().mockResolvedValue(() => Promise.resolve()),
    },
  };
});

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  console.log('Mongoose mock teardown complete');
});
