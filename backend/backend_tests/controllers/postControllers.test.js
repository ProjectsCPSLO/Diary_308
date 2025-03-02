import mongoose from 'mongoose';
import { jest } from '@jest/globals';

const mockPostFind = jest.fn();
const mockPostFindById = jest.fn();
const mockPostCreate = jest.fn();
const mockPostFindOneAndDelete = jest.fn();
const mockPostFindOneAndUpdate = jest.fn();
const mockPostFindOne = jest.fn();

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
  });
});