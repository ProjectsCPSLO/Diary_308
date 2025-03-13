import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Mock the User model and JWT functions
const mockUserFindOne = jest.fn();

jest.unstable_mockModule('../../models/User.js', () => ({
  default: {
    findOne: mockUserFindOne
  }
}));

// Spy on console.log
const originalConsoleLog = console.log;
console.log = jest.fn();

// Mock jwt verify
const originalJwtVerify = jwt.verify;
jwt.verify = jest.fn();

let auth;

beforeAll(async () => {
  auth = await import('../../middleware/auth.js');
});

afterAll(() => {
  // Restore original functions
  jwt.verify = originalJwtVerify;
  console.log = originalConsoleLog;
});

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  const mockUserId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: 'Bearer fake-token'
      }
    };
    
    mockRes = { 
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    mockNext = jest.fn();
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Default mock implementations
    jwt.verify.mockReturnValue({ _id: mockUserId });
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: mockUserId })
    });
  });

  it('should verify token and set req.user', async () => {
    await auth.requireAuth(mockReq, mockRes, mockNext);
    
    expect(jwt.verify).toHaveBeenCalledWith('fake-token', process.env.JWT_SECRET);
    expect(mockUserFindOne).toHaveBeenCalledWith({ _id: mockUserId });
    expect(mockReq.user).toEqual({ _id: mockUserId });
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 401 if no authorization header', async () => {
    mockReq.headers.authorization = undefined;
    
    await auth.requireAuth(mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'authorization token required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if JWT verification fails', async () => {
    const error = new Error('Invalid token');
    jwt.verify.mockImplementation(() => {
      throw error;
    });
    
    await auth.requireAuth(mockReq, mockRes, mockNext);
    
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'not authorized' });
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should return 401 if user not found', async () => {
    mockUserFindOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });
    await auth.requireAuth(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();

  });
});