import mongoose from 'mongoose';
import User from '../../models/User';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongoServer;

dotenv.config();

describe('User Model', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });
  beforeEach(async () => {
    // Clear the User collection before each test
    await User.deleteMany({});
  });

  describe('User.signup static method', () => {
    it('should create a new user', async () => {
      const user = await User.signup('test@test.com', 'Test123!');
      expect(user.email).toBe('test@test.com');
      expect(user.password).not.toBe('Test123!'); // Password should be hashed
    });

    it('should not create user with invalid email', async () => {
      await expect(User.signup('invalid-email', 'Test123!')).rejects.toThrow(
        'invalid email'
      );
    });
  });

  describe('User.login static method', () => {
    beforeEach(async () => {
      // Create a user before each login test
      await User.signup('test@test.com', 'Test123!');
    });

    it('should login valid user', async () => {
      const user = await User.login('test@test.com', 'Test123!');
      expect(user.email).toBe('test@test.com');
    });

    it('should not login with wrong password', async () => {
      await expect(
        User.login('test@test.com', 'WrongPass123!')
      ).rejects.toThrow('incorrect password');
    });
  });

  describe('User.signup static method', () => {
    it('should not create user without email', async () => {
      await expect(User.signup('', 'Test123!')).rejects.toThrow(
        'all fields required'
      );
    });

    it('should not create user without password', async () => {
      await expect(User.signup('test@test.com', '')).rejects.toThrow(
        'all fields required'
      );
    });

    it('should not create user with weak password', async () => {
      await expect(User.signup('test@test.com', '12345')).rejects.toThrow(
        'password not strong'
      );
    });

    it('should not create user with an already registered email', async () => {
      await User.signup('test@test.com', 'Test123!');
      await expect(User.signup('test@test.com', 'Test123!')).rejects.toThrow(
        'email already registered'
      );
    });
  });

  describe('User.login static method', () => {
    it('should not login without email', async () => {
      await expect(User.login('', 'Test123!')).rejects.toThrow(
        'all fields required'
      );
    });

    it('should not login without password', async () => {
      await expect(User.login('test@test.com', '')).rejects.toThrow(
        'all fields required'
      );
    });

    it('should not login with unregistered email', async () => {
      await expect(
        User.login('notregistered@test.com', 'Test123!')
      ).rejects.toThrow('email not registered');
    });
  });
});
