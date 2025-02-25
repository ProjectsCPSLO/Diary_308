import mongoose from 'mongoose';
import Post from '../../models/Post';
import dotenv from 'dotenv';

dotenv.config();

describe('Post Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
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
