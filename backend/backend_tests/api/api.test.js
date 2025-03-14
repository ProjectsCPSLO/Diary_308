
import { jest } from '@jest/globals';


jest.setTimeout(20000);


jest.unstable_mockModule('bcrypt', () => ({
  default: {
    compare: jest.fn().mockResolvedValue(true),
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashedpassword')
  },
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedpassword')
}));


import mongoose from 'mongoose';
import request from 'supertest';
import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import postRoutes from '../../routes/posts.js';
import userRoutes from '../../routes/users.js';


console.log('Test environment:', process.env.NODE_ENV);
console.log('MongoDB URI available:', !!process.env.MONGO_URI);
console.log('JWT Secret available:', !!process.env.JWT_SECRET);

dotenv.config();

describe('Posts API', () => {
  let server;
  let token;
  let app;

  beforeAll(async () => {

    app = express();
    app.use(express.json());
    app.use(cors());
    

    app.use('/api/posts', postRoutes);
    app.use('/api/user', userRoutes);
    

    try {
      const mongoUri = process.env.MONGO_URI || 'mongodb+srv://MuskaS:ZZolUuWxkqYxZeYo@diary.ycycy.mongodb.net/';
      console.log('Connecting to MongoDB with URI:', mongoUri);
      
      await mongoose.connect(mongoUri, {

      });
      
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      throw error;
    }


    server = app.listen(0);
    

    try {

      try {
        await request(server)
          .post('/api/user/signup')
          .send({
            email: 'test@example.com',
            password: 'Password@123',
          });
        console.log('Test user created successfully or already exists');
      } catch (err) {
        console.log('Signup attempt:', err.message);

      }
      

      const res = await request(server)
        .post('/api/user/login')
        .send({
          email: 'test@example.com',
          password: 'Password@123',
        });
      
      console.log('Login response status:', res.status);
      console.log('Login response body:', JSON.stringify(res.body, null, 2));
      
      if (res.status !== 200) {
        throw new Error(`Login failed with status ${res.status}: ${JSON.stringify(res.body)}`);
      }
      
      token = res.body.token;
      
      if (!token) {
        throw new Error('Token is missing from response');
      }
      
      console.log('Successfully obtained authentication token');
    } catch (error) {
      console.error('Authentication error:', error.message);
      throw error;
    }
  });

  it('GET /api/posts should return an array of posts', async () => {
    try {
      const response = await request(server)
        .get('/api/posts')
        .set('Authorization', `Bearer ${token}`);
        
      console.log('GET response status:', response.status);
      console.log('GET response body sample:', JSON.stringify(response.body.slice(0, 2), null, 2));
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      

      if (response.body.length > 0) {

        expect(response.body[0]).toHaveProperty('_id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('content');
      } else {
        console.log('No posts found in the database');
      }
    } catch (error) {
      console.error('GET /api/posts test error:', error.message);
      throw error;
    }
  });

  it('ensures POST works by creating and posting a diary entry and validating through a GET', async () => {
    const randomText = `Test Title #${Math.floor(Math.random() * 1000000)}`;
    const newPost = {
      title: randomText,
      content: randomText,
      mood: 'Sad',
      date: new Date().toISOString(),
      location: null, 
      password: null,
    };

    const postResponse = await request(server)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost)
      .set('Content-Type', 'application/json')
      .expect(200);
      
    expect(postResponse.body).toHaveProperty('_id');
    expect(postResponse.body.title).toBe(randomText);
    expect(postResponse.body.content).toBe(`${randomText}`);
    expect(postResponse.body.mood).toBe('Sad');
    expect(postResponse.body.location).toBeNull();

    const getResponse = await request(server)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      

    const foundPost = getResponse.body.find(
      (post) => post._id === postResponse.body._id
    );
    
    expect(foundPost).toBeDefined();
    expect(foundPost).toMatchObject({
      _id: postResponse.body._id,
      title: randomText,
      content: `${randomText}`,
      mood: 'Sad',
      password: null,
      location: null,
    });
  });

  afterAll(async () => {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
    await mongoose.connection.close();
  });
});