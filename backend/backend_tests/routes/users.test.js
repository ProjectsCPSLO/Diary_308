import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import userRoutes from '../../routes/users.js';

// Set JWT secret for tests
process.env.JWT_SECRET = 'test-secret';

// Mock User.signup and User.login
const originalUserSignup = User.signup;
const originalUserLogin = User.login;
const originalJwtSign = jwt.sign;

// Replace them with jest functions
User.signup = jest.fn();
User.login = jest.fn();
jwt.sign = jest.fn();

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    jwt.sign.mockReturnValue('test-token');
    
    User.signup.mockImplementation((email, password) => {
      if (!email) throw new Error('All fields required');
      if (!password) throw new Error('All fields required');
      if (email === 'invalid-email') throw new Error('Invalid email');
      if (password === 'weak') throw new Error('Password not strong enough');
      if (email === 'exists@test.com') throw new Error('Email already registered');
      
      return Promise.resolve({
        _id: 'userid123',
        email,
        collaborationCode: 'ABC123',
      });
    });
    
    User.login.mockImplementation((email, password) => {
      if (!email || !password) throw new Error('All fields required');
      if (email === 'nonexistent@test.com') throw new Error('Email not registered');
      if (password === 'wrongpassword') throw new Error('Incorrect password');
      
      return Promise.resolve({
        _id: 'userid123',
        email,
        collaborationCode: 'ABC123',
      });
    });
  });
  
  afterAll(() => {
    // Restore original functions
    User.signup = originalUserSignup;
    User.login = originalUserLogin;
    jwt.sign = originalJwtSign;
  });

  describe('POST /api/user/signup', () => {
    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'invalid-email',
          password: 'Test123!'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'test@test.com',
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return token and user info for valid signup', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'new@test.com',
          password: 'Test123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'test-token');
      expect(response.body).toHaveProperty('email', 'new@test.com');
      expect(response.body).toHaveProperty('collaborationCode', 'ABC123');
    });
  });

  describe('POST /api/user/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'test@test.com',
          password: 'Test123!'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'test-token');
      expect(response.body).toHaveProperty('email', 'test@test.com');
    });

    it('should not login non-existent user', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Test123!'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});