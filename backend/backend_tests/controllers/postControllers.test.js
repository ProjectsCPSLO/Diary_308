import mongoose from 'mongoose';
import { jest } from '@jest/globals';

const mockPostFind = jest.fn();
const mockPostFindById = jest.fn();
const mockPostCreate = jest.fn();
const mockPostFindOneAndDelete = jest.fn();
const mockPostFindOneAndUpdate = jest.fn();
const mockPostFindOne = jest.fn();
const mockPostSave = jest.fn();

jest.unstable_mockModule('../../models/Post.js', () => ({
  default: {
    find: mockPostFind,
    findById: mockPostFindById,
    create: mockPostCreate,
    findOneAndDelete: mockPostFindOneAndDelete,
    findOneAndUpdate: mockPostFindOneAndUpdate,
    findOne: mockPostFindOne
  }
}));

const mockBcryptCompare = jest.fn();
const mockBcryptGenSalt = jest.fn();
const mockBcryptHash = jest.fn();

jest.unstable_mockModule('bcrypt', () => ({
  default: {
    compare: mockBcryptCompare,
    genSalt: mockBcryptGenSalt,
    hash: mockBcryptHash
  },
  compare: mockBcryptCompare,
  genSalt: mockBcryptGenSalt,
  hash: mockBcryptHash
}));

let postControllers;
let bcrypt;

beforeAll(async () => {
  postControllers = await import('../../controllers/postControllers.js');
  bcrypt = await import('bcrypt');
});

describe('Post Controllers', () => {
  let mockReq;
  let mockRes;
  const mockPostId = new mongoose.Types.ObjectId().toString();
  const mockUserId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    mockReq = {
      params: { id: mockPostId },
      user: { _id: mockUserId },
      body: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockPostFindById.mockResolvedValue({
      _id: mockPostId,
      title: 'Test Post',
      save: mockPostSave
    });
    
    mockPostSave.mockResolvedValue(true);
    
    mockBcryptGenSalt.mockResolvedValue('fakesalt');
    mockBcryptHash.mockResolvedValue('hashedpassword');
    mockBcryptCompare.mockResolvedValue(true);
  });

  describe('getAllPosts', () => {
    it('should return all posts for the user', async () => {
      const mockPosts = [
        { _id: 'post1', title: 'Post 1' },
        { _id: 'post2', title: 'Post 2' }
      ];

      mockPostFind.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPosts)
      });

      await postControllers.getAllPosts(mockReq, mockRes);

      expect(mockPostFind).toHaveBeenCalledWith({
        $or: [{ user_id: mockUserId }, { sharedWith: mockUserId }]
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockPostFind.mockReturnValue({
        sort: jest.fn().mockRejectedValue(error)
      });

      await postControllers.getAllPosts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getPost', () => {
    it('should return 404 for invalid ObjectId', async () => {
      mockReq.params.id = 'invalid-id';

      await postControllers.getPost(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post does not exist' });
    });

    it('should return 404 if post not found', async () => {
      mockPostFindById.mockResolvedValue(null);

      await postControllers.getPost(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post does not exist' });
    });

    it('should return 403 if post is password protected and no password provided', async () => {
      mockPostFindById.mockResolvedValue({
        _id: mockPostId,
        password: 'hashedpassword'
      });

      await postControllers.getPost(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Password required',
        isPasswordProtected: true
      });
    });

    it('should return 403 if provided password is incorrect', async () => {
      mockPostFindById.mockResolvedValue({
        _id: mockPostId,
        password: 'hashedpassword'
      });

      mockReq.query.password = 'wrongpassword';
      
      mockBcryptCompare.mockResolvedValue(false);

      await postControllers.getPost(mockReq, mockRes);

      expect(mockBcryptCompare).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Incorrect password',
        isPasswordProtected: true
      });
    });

    it('should return post if password is correct', async () => {
      const mockPost = {
        _id: mockPostId,
        title: 'Protected Post',
        password: 'hashedpassword'
      };

      mockPostFindById.mockResolvedValue(mockPost);
      mockReq.query.password = 'correctpassword';

      mockBcryptCompare.mockImplementation((pwd, hash) => {
        if (pwd === 'correctpassword') return Promise.resolve(true);
        return Promise.resolve(false);
      });

      await postControllers.getPost(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPost);
    });
    
    it('should handle bcrypt compare errors', async () => {
      mockPostFindById.mockResolvedValue({
        _id: mockPostId,
        password: 'hashedpassword'
      });
      
      mockReq.query.password = 'testpassword';
      
      const error = new Error('Bcrypt error');
      mockBcryptCompare.mockRejectedValue(error);
      
      await postControllers.getPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  
  describe('createPost', () => {
    beforeEach(() => {
      mockReq.body = {
        title: 'New Post',
        content: 'Post content',
        date: '2023-01-01',
        mood: 'Happy',
        tags: ['tag1', 'tag2'],
        location: { lat: 47.6062, lng: -122.3321 }
      };
      
      mockPostCreate.mockResolvedValue({
        _id: mockPostId,
        ...mockReq.body,
        user_id: mockUserId
      });
    });
    
    it('should create a post without password', async () => {
      await postControllers.createPost(mockReq, mockRes);
      
      expect(mockPostCreate).toHaveBeenCalledWith({
        title: 'New Post',
        content: 'Post content',
        date: expect.any(Date),
        user_id: mockUserId,
        mood: 'Happy',
        password: null,
        tags: ['tag1', 'tag2'],
        location: { lat: 47.6062, lng: -122.3321 }
      });
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    it('should create a post with password', async () => {
      mockReq.body.password = 'securepassword';
      
      await postControllers.createPost(mockReq, mockRes);
      
      expect(mockBcryptGenSalt).toHaveBeenCalledWith(10);
      expect(mockBcryptHash).toHaveBeenCalledWith('securepassword', 'fakesalt');
      expect(mockPostCreate).toHaveBeenCalledWith({
        title: 'New Post',
        content: 'Post content',
        date: expect.any(Date),
        user_id: mockUserId,
        mood: 'Happy',
        password: 'hashedpassword',
        tags: ['tag1', 'tag2'],
        location: { lat: 47.6062, lng: -122.3321 }
      });
      
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    it('should handle errors during post creation', async () => {
      const error = new Error('Database error');
      mockPostCreate.mockRejectedValue(error);
      
      await postControllers.createPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
    
    it('should handle errors during password hashing', async () => {
      mockReq.body.password = 'securepassword';
      
      const error = new Error('Bcrypt error');
      mockBcryptHash.mockRejectedValue(error);
      
      await postControllers.createPost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  
  describe('deletePost', () => {
    it('should delete a post', async () => {
      mockPostFindOneAndDelete.mockResolvedValue({
        _id: mockPostId,
        title: 'Deleted Post'
      });
      
      await postControllers.deletePost(mockReq, mockRes);
      
      expect(mockPostFindById).toHaveBeenCalledWith(mockPostId);
      expect(mockPostFindOneAndDelete).toHaveBeenCalledWith({ _id: mockPostId });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    it('should return 404 for invalid ObjectId', async () => {
      mockReq.params.id = 'invalid-id';
      
      await postControllers.deletePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'post does not exist' });
    });
    
    it('should return 404 if post not found', async () => {
      mockPostFindById.mockResolvedValue(null);
      
      await postControllers.deletePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'post does not exist' });
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockPostFindById.mockRejectedValue(error);
      
      await postControllers.deletePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  
  describe('updatePost', () => {
    beforeEach(() => {
      mockReq.body = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      
      mockPostFindOneAndUpdate.mockResolvedValue({
        _id: mockPostId,
        ...mockReq.body
      });
    });
    
    it('should update a post', async () => {
      await postControllers.updatePost(mockReq, mockRes);
      
      expect(mockPostFindById).toHaveBeenCalledWith(mockPostId);
      expect(mockPostFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockPostId },
        mockReq.body,
        { new: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    it('should return 404 for invalid ObjectId', async () => {
      mockReq.params.id = 'invalid-id';
      
      await postControllers.updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'post does not exist' });
    });
    
    it('should return 404 if post not found', async () => {
      mockPostFindById.mockResolvedValue(null);
      
      await postControllers.updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'post does not exist' });
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockPostFindById.mockRejectedValue(error);
      
      await postControllers.updatePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  
  describe('verifyPassword', () => {
    beforeEach(() => {
      mockReq.body = { password: 'testpassword' };
      
      mockPostFindById.mockResolvedValue({
        _id: mockPostId,
        title: 'Password Protected Post',
        password: 'hashedpassword'
      });
    });
    
    it('should verify correct password', async () => {
      mockBcryptCompare.mockResolvedValue(true);
      
      await postControllers.verifyPassword(mockReq, mockRes);
      
      expect(mockPostFindById).toHaveBeenCalledWith(mockPostId);
      expect(mockBcryptCompare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
    
    it('should return 400 if no password provided', async () => {
      mockReq.body = {};
      
      await postControllers.verifyPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Password is required' });
    });
    
    it('should return 404 if post not found', async () => {
      mockPostFindById.mockResolvedValue(null);
      
      await postControllers.verifyPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post does not exist' });
    });
    
    it('should return 400 if post is not password protected', async () => {
      mockPostFindById.mockResolvedValue({
        _id: mockPostId,
        title: 'Regular Post',
        password: null
      });
      
      await postControllers.verifyPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post is not password protected' });
    });
    
    it('should return 403 if password is incorrect', async () => {
      mockBcryptCompare.mockResolvedValue(false);
      
      await postControllers.verifyPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Incorrect password' });
    });
    
    it('should handle errors', async () => {
      const error = new Error('Verification error');
      mockBcryptCompare.mockRejectedValue(error);
      
      await postControllers.verifyPassword(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Error verifying password' });
    });
  });
  
  describe('sharePost', () => {
    beforeEach(() => {
      mockReq.body = { 
        collaboratorIds: ['collab1', 'collab2'] 
      };
      
      mockPostFindOne.mockResolvedValue({
        _id: mockPostId,
        title: 'Shared Post',
        sharedWith: ['collab3'],
        save: mockPostSave
      });
    });
    
    it('should share a post with collaborators', async () => {
      await postControllers.sharePost(mockReq, mockRes);
      
      expect(mockPostFindOne).toHaveBeenCalledWith({ 
        _id: mockPostId, 
        user_id: mockUserId 
      });
      expect(mockPostSave).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Post shared successfully',
        sharedWith: ['collab3', 'collab1', 'collab2']
      });
    });
    
    it('should not duplicate existing collaborators', async () => {
      mockPostFindOne.mockResolvedValue({
        _id: mockPostId,
        title: 'Shared Post',
        sharedWith: ['collab1', 'collab3'],
        save: mockPostSave
      });
      
      await postControllers.sharePost(mockReq, mockRes);
      
      expect(mockPostSave).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Post shared successfully',
        sharedWith: ['collab1', 'collab3', 'collab2']
      });
    });
    
    it('should return 404 if post not found', async () => {
      mockPostFindOne.mockResolvedValue(null);
      
      await postControllers.sharePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Post not found' });
    });
    
    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockPostFindOne.mockRejectedValue(error);
      
      await postControllers.sharePost(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});