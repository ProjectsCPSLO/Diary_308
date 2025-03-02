import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import * as userControllers from '../../controllers/userControllers.js';

// Set JWT secret for tests
process.env.JWT_SECRET = 'test-secret';

// Save original functions
const originalJwtSign = jwt.sign;
const originalUserSignup = User.signup;
const originalUserLogin = User.login;
const originalUserFindById = User.findById;

describe('User Controllers', () => {
  let mockReq;
  let mockRes;
  const mockUserId = new mongoose.Types.ObjectId();
  
  // Mock user object with collaborators for the getProfile test
  const mockUserWithCollaborators = {
    _id: mockUserId,
    email: 'test@example.com',
    collaborationCode: 'ABC123',
    collaborators: [
      { _id: 'collab1', email: 'collab1@example.com' }
    ]
  };
  
  // Mock user object with addCollaborator method
  const mockUserWithMethod = {
    _id: mockUserId,
    addCollaborator: jest.fn().mockResolvedValue({
      _id: 'collab2',
      email: 'collab2@example.com'
    })
  };

  beforeAll(() => {
    // Replace with jest mocks
    jwt.sign = jest.fn();
    User.signup = jest.fn();
    User.login = jest.fn();
    User.findById = jest.fn();
  });
  
  afterAll(() => {
    // Restore original functions
    jwt.sign = originalJwtSign;
    User.signup = originalUserSignup;
    User.login = originalUserLogin;
    User.findById = originalUserFindById;
  });

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { _id: mockUserId }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Reset all mocks
    jest.clearAllMocks();
    
    // Default mock implementations
    jwt.sign.mockReturnValue('fake-token');
    
    User.signup.mockResolvedValue({
      _id: mockUserId,
      email: 'test@example.com',
      collaborationCode: 'ABC123'
    });
    
    User.login.mockResolvedValue({
      _id: mockUserId,
      email: 'test@example.com',
      collaborationCode: 'ABC123'
    });
    
    // For getProfile and getCollaborators tests
    User.findById.mockImplementation(() => {
      return {
        select: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockUserWithCollaborators)
      };
    });
  });

  describe('signupUser', () => {
    beforeEach(() => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'StrongPass123!'
      };
    });

    it('should create a new user and return token', async () => {
      await userControllers.signupUser(mockReq, mockRes);

      expect(User.signup).toHaveBeenCalledWith('test@example.com', 'StrongPass123!');
      expect(jwt.sign).toHaveBeenCalledWith({ _id: mockUserId }, 'test-secret', {
        expiresIn: '3d'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'fake-token',
        collaborationCode: 'ABC123'
      });
    });

    it('should handle signup errors', async () => {
      const error = new Error('Email already registered');
      User.signup.mockRejectedValue(error);

      await userControllers.signupUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('loginUser', () => {
    beforeEach(() => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'StrongPass123!'
      };
    });

    it('should login user and return token', async () => {
      await userControllers.loginUser(mockReq, mockRes);

      expect(User.login).toHaveBeenCalledWith('test@example.com', 'StrongPass123!');
      expect(jwt.sign).toHaveBeenCalledWith({ _id: mockUserId }, 'test-secret', {
        expiresIn: '3d'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: 'fake-token',
        collaborationCode: 'ABC123'
      });
    });

    it('should handle login errors', async () => {
      const error = new Error('Incorrect password');
      User.login.mockRejectedValue(error);

      await userControllers.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      await userControllers.getProfile(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserWithCollaborators);
    });

    it('should handle errors', async () => {
      // Override the User.findById implementation for this test
      User.findById.mockImplementation(() => {
        return {
          select: jest.fn().mockReturnThis(),
          populate: jest.fn().mockRejectedValue(new Error('Database error'))
        };
      });

      await userControllers.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: expect.any(String)
      });
    });
  });

  describe('getCollaborators', () => {
    it('should return user collaborators', async () => {
      await userControllers.getCollaborators(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserWithCollaborators.collaborators);
    });

    it('should handle errors', async () => {
      // Override the User.findById implementation for this test
      User.findById.mockImplementation(() => {
        return {
          populate: jest.fn().mockRejectedValue(new Error('Database error'))
        };
      });

      await userControllers.getCollaborators(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: expect.any(String)
      });
    });
  });

  describe('addCollaborator', () => {
    beforeEach(() => {
      mockReq.body = {
        collaborationCode: 'XYZ789'
      };
      
      // Override User.findById for the addCollaborator tests
      User.findById.mockResolvedValue(mockUserWithMethod);
    });

    it('should add collaborator and return collaborator info', async () => {
      await userControllers.addCollaborator(mockReq, mockRes);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(mockUserWithMethod.addCollaborator).toHaveBeenCalledWith('XYZ789');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        collaborator: {
          _id: 'collab2',
          email: 'collab2@example.com'
        }
      });
    });

    it('should handle invalid collaboration code error', async () => {
      mockUserWithMethod.addCollaborator.mockRejectedValue(new Error('Invalid collaboration code'));

      await userControllers.addCollaborator(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: expect.any(String)
      });
    });

    it('should handle database errors', async () => {
      User.findById.mockRejectedValue(new Error('Database error'));

      await userControllers.addCollaborator(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: expect.any(String)
      });
    });
  });
});