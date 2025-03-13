import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Mock middleware
jest.unstable_mockModule('../../middleware/auth.js', () => ({
  requireAuth: jest.fn((req, res, next) => {
    req.user = { _id: 'mockuserid123' };
    next();
  })
}));

// Mock controllers
const mockGetAllPosts = jest.fn();
const mockGetPost = jest.fn();
const mockCreatePost = jest.fn();
const mockDeletePost = jest.fn();
const mockUpdatePost = jest.fn();
const mockVerifyPassword = jest.fn();
const mockSharePost = jest.fn();

jest.unstable_mockModule('../../controllers/postControllers.js', () => ({
  getAllPosts: mockGetAllPosts,
  getPost: mockGetPost,
  createPost: mockCreatePost,
  deletePost: mockDeletePost,
  updatePost: mockUpdatePost,
  verifyPassword: mockVerifyPassword,
  sharePost: mockSharePost
}));

// App and routes
let app;
let postsRoutes;

beforeAll(async () => {
  // Import routes after mocking dependencies
  postsRoutes = (await import('../../routes/posts.js')).default;
  
  // Create express app
  app = express();
  app.use(express.json());
  app.use('/api/posts', postsRoutes);
});

describe('Posts Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockGetAllPosts.mockImplementation((req, res) => {
      res.status(200).json([{ _id: 'post1', title: 'Test Post' }]);
    });
    
    mockGetPost.mockImplementation((req, res) => {
      res.status(200).json({ _id: req.params.id, title: 'Single Post' });
    });
    
    mockCreatePost.mockImplementation((req, res) => {
      res.status(200).json({ _id: 'newpost123', ...req.body });
    });
    
    mockDeletePost.mockImplementation((req, res) => {
      res.status(200).json({ _id: req.params.id, message: 'Post deleted' });
    });
    
    mockUpdatePost.mockImplementation((req, res) => {
      res.status(200).json({ _id: req.params.id, ...req.body, updated: true });
    });
    
    mockVerifyPassword.mockImplementation((req, res) => {
      if (req.body.password === 'correct') {
        res.status(200).json({ _id: req.params.id, verified: true });
      } else {
        res.status(403).json({ error: 'Incorrect password' });
      }
    });
    
    mockSharePost.mockImplementation((req, res) => {
      res.status(200).json({ 
        message: 'Post shared successfully',
        sharedWith: req.body.collaboratorIds 
      });
    });
  });

  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const response = await request(app).get('/api/posts');
      
      expect(response.status).toBe(200);
      expect(mockGetAllPosts).toHaveBeenCalled();
      expect(response.body).toEqual([{ _id: 'post1', title: 'Test Post' }]);
    });
  });
  
  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'New Post',
        content: 'Test content',
        mood: 'Happy'
      };
      
      const response = await request(app)
        .post('/api/posts')
        .send(postData);
      
      expect(response.status).toBe(200);
      expect(mockCreatePost).toHaveBeenCalled();
      expect(response.body).toHaveProperty('_id', 'newpost123');
      expect(response.body).toHaveProperty('title', 'New Post');
    });
  });
  
  describe('GET /api/posts/:id', () => {
    it('should get a single post', async () => {
      const response = await request(app).get('/api/posts/post123');
      
      expect(response.status).toBe(200);
      expect(mockGetPost).toHaveBeenCalled();
      expect(response.body).toHaveProperty('_id', 'post123');
    });
  });
  
  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      const response = await request(app).delete('/api/posts/post123');
      
      expect(response.status).toBe(200);
      expect(mockDeletePost).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Post deleted');
    });
  });
  
  describe('PATCH /api/posts/:id', () => {
    it('should update a post', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      
      const response = await request(app)
        .patch('/api/posts/post123')
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(mockUpdatePost).toHaveBeenCalled();
      expect(response.body).toHaveProperty('title', 'Updated Title');
      expect(response.body).toHaveProperty('updated', true);
    });
  });
  
  describe('POST /api/posts/:id/verify', () => {
    it('should verify correct password', async () => {
      const response = await request(app)
        .post('/api/posts/post123/verify')
        .send({ password: 'correct' });
      
      expect(response.status).toBe(200);
      expect(mockVerifyPassword).toHaveBeenCalled();
      expect(response.body).toHaveProperty('verified', true);
    });
    
    it('should reject incorrect password', async () => {
      const response = await request(app)
        .post('/api/posts/post123/verify')
        .send({ password: 'wrong' });
      
      expect(response.status).toBe(403);
      expect(mockVerifyPassword).toHaveBeenCalled();
      expect(response.body).toHaveProperty('error', 'Incorrect password');
    });
  });
  
  describe('POST /api/posts/:id/share', () => {
    it('should share a post with collaborators', async () => {
      const response = await request(app)
        .post('/api/posts/post123/share')
        .send({ collaboratorIds: ['user1', 'user2'] });
      
      expect(response.status).toBe(200);
      expect(mockSharePost).toHaveBeenCalled();
      expect(response.body).toHaveProperty('message', 'Post shared successfully');
      expect(response.body.sharedWith).toEqual(['user1', 'user2']);
    });
  });
});