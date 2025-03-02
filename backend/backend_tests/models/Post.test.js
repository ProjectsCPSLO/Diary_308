import mongoose from 'mongoose';
import Post from '../../models/Post.js';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

dotenv.config();

describe('Post Model', () => {
  let testUserId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    testUserId = new mongoose.Types.ObjectId();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it('should create a valid post', async () => {
    const validPost = {
      title: 'Test Post',
      content: 'This is a test post content',
      date: new Date(),
      user_id: testUserId,
      mood: 'Happy',
      tags: ['test', 'diary']
    };

    const post = await Post.create(validPost);
    expect(post.title).toBe(validPost.title);
    expect(post.content).toBe(validPost.content);
    expect(post.user_id).toEqual(testUserId);
    expect(post.mood).toBe('Happy');
    expect(post.tags).toEqual(['test', 'diary']);
    expect(post.password).toBeNull();
    expect(post.sharedWith).toEqual([]);
  });

  it('should throw an error for missing required fields', async () => {
    const invalidPost = {
      content: 'Test Content',
      user_id: testUserId
    };

    await expect(Post.create(invalidPost)).rejects.toThrow();
  });

  it('should throw an error for invalid mood values', async () => {
    const invalidPost = {
      title: 'Test Post',
      content: 'Test Content',
      date: new Date(),
      user_id: testUserId,
      mood: 'Angry', 
    };

    await expect(Post.create(invalidPost)).rejects.toThrow();
  });

  it('should accept valid mood values', async () => {
    const validMoods = ['Happy', 'Sad', 'Excited', 'Anxious', 'Neutral'];
    
    for (const mood of validMoods) {
      const post = await Post.create({
        title: `Test Post - ${mood}`,
        content: 'Test Content',
        date: new Date(),
        user_id: testUserId,
        mood: mood,
      });
      
      expect(post.mood).toBe(mood);
    }
  });

  it('should default to "Neutral" if mood is not provided', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      date: new Date(),
      user_id: testUserId,
    });
    
    expect(post.mood).toBe('Neutral');
  });

  it('should store password as null by default', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      date: new Date(),
      user_id: testUserId,
    });
    
    expect(post.password).toBeNull();
  });

  it('should store an empty array for tags by default', async () => {
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      date: new Date(),
      user_id: testUserId,
    });
    
    expect(post.tags).toEqual([]);
  });

  it('should store current date if date is not provided', async () => {
    const now = new Date();
    
    const post = await Post.create({
      title: 'Test Post',
      content: 'Test Content',
      user_id: testUserId,
    });
    
    const diffInSeconds = Math.abs((post.date - now) / 1000);
    expect(diffInSeconds).toBeLessThan(10);
  });
});