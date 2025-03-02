import express from 'express';
import cors from 'cors';
import postRoutes from '../../routes/posts.js';
import userRoutes from '../../routes/users.js';

export const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use('/api/posts', postRoutes);
  app.use('/api/user', userRoutes);

  return app;
};