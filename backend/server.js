import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    mongoose.connect(process.env.MONGO_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB()
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log('REST API is listening.');
    });
  })
  .catch((err) => console.log(err));

export { app };
