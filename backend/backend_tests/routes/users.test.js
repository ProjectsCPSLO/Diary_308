// backend_tests/routes/users.test.js
import request from 'supertest';
import { app } from '../../server';
import User from '../../models/User';
import { jest } from '@jest/globals';

// backend_tests/routes/users.test.js
jest.setTimeout(100000);

describe('User Routes', () => {
  describe('POST /api/user/signup', () => {
    it('should validate email format', async () => {
      const response = await request(app).post('/api/user/signup').send({
        email: 'invalid-email',
        password: 'Test123!',
      });

      expect(response.status).toBe(400);
    });

    it('should validate password strength', async () => {
      const response = await request(app).post('/api/user/signup').send({
        email: 'test@test.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      // Create a user before each test
      await request(app).post('/api/user/signup').send({
        email: 'test@test.com',
        password: 'Test123!',
      });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'test@test.com',
        password: 'Test123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('email', 'test@test.com');
    });

    it('should not login non-existent user', async () => {
      const response = await request(app).post('/api/user/login').send({
        email: 'nonexistent@test.com',
        password: 'Test123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const response = await request(app).post('/api/user/login').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
