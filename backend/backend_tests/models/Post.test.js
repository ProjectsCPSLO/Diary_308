import mongoose from 'mongoose';
import Post from '../../models/Post';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongoServer;

dotenv.config();

describe('Post Model', () => {
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
    await Post.deleteMany({});
  });

  it('should throw an error for invalid mood values', async () => {
    const invalidPost = {
      title: 'Test Post',
      content: 'Test Content',
      date: new Date(),
      user_id: new mongoose.Types.ObjectId(),
      mood: 'angry', // Invalid mood
    };

    await expect(Post.create(invalidPost)).rejects.toThrow();
  });
});
