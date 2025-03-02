import mongoose from 'mongoose';
import User from '../../models/User.js';
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
    await User.deleteMany({});
  });

  describe('User.signup static method', () => {
    it('should create a new user', async () => {
      const user = await User.signup('test@test.com', 'Test123!');
      expect(user.email).toBe('test@test.com');
      expect(user.password).not.toBe('Test123!'); 
      expect(user.collaborationCode).toBeDefined();
      expect(user.collaborationCode.length).toBe(6); 
    });

    it('should not create user with invalid email', async () => {
      await expect(User.signup('invalid-email', 'Test123!')).rejects.toThrow(
        'Invalid email'
      );
    });

    it('should not create user without email', async () => {
      await expect(User.signup('', 'Test123!')).rejects.toThrow(
        'All fields required'
      );
    });

    it('should not create user without password', async () => {
      await expect(User.signup('test@test.com', '')).rejects.toThrow(
        'All fields required'
      );
    });

    it('should not create user with weak password', async () => {
      await expect(User.signup('test@test.com', '12345')).rejects.toThrow(
        'Password not strong enough'
      );
    });

    it('should not create user with an already registered email', async () => {
      await User.signup('test@test.com', 'Test123!');
      await expect(User.signup('test@test.com', 'Test123!')).rejects.toThrow(
        'Email already registered'
      );
    });
  });

  describe('User.login static method', () => {
    beforeEach(async () => {
      await User.signup('test@test.com', 'Test123!');
    });

    it('should login valid user', async () => {
      const user = await User.login('test@test.com', 'Test123!');
      expect(user.email).toBe('test@test.com');
    });

    it('should not login with wrong password', async () => {
      await expect(
        User.login('test@test.com', 'WrongPass123!')
      ).rejects.toThrow('Incorrect password');
    });

    it('should not login without email', async () => {
      await expect(User.login('', 'Test123!')).rejects.toThrow(
        'All fields required'
      );
    });

    it('should not login without password', async () => {
      await expect(User.login('test@test.com', '')).rejects.toThrow(
        'All fields required'
      );
    });

    it('should not login with unregistered email', async () => {
      await expect(
        User.login('notregistered@test.com', 'Test123!')
      ).rejects.toThrow('Email not registered');
    });
  });

  describe('User.addCollaborator method', () => {
    let user1, user2;

    beforeEach(async () => {
      user1 = await User.signup('user1@test.com', 'Test123!');
      user2 = await User.signup('user2@test.com', 'Test123!');
    });

    it('should add a collaborator using the collaboration code', async () => {
      const collaborationCode = user2.collaborationCode;
      const collaborator = await user1.addCollaborator(collaborationCode);
      
      expect(collaborator.email).toBe('user2@test.com');

      const updatedUser1 = await User.findById(user1._id);
      expect(updatedUser1.collaborators).toContainEqual(user2._id);
    });

    it('should throw error if no collaboration code provided', async () => {
      await expect(user1.addCollaborator('')).rejects.toThrow(
        'Collaboration code required'
      );
    });

    it('should throw error for invalid collaboration code', async () => {
      await expect(user1.addCollaborator('INVALID')).rejects.toThrow(
        'Invalid collaboration code'
      );
    });

    it('should not allow adding yourself as a collaborator', async () => {
      await expect(
        user1.addCollaborator(user1.collaborationCode)
      ).rejects.toThrow('Cannot add yourself as a collaborator');
    });

    it('should not add the same collaborator twice', async () => {
      await user1.addCollaborator(user2.collaborationCode);

      await expect(
        user1.addCollaborator(user2.collaborationCode)
      ).rejects.toThrow('Already a collaborator');
    });
  });
});