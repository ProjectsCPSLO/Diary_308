
// // backend_tests/api/api.test.js
// import { jest } from '@jest/globals';

// import mongoose from 'mongoose';
// import request from 'supertest';
// import app from '../../app.js';
// import dotenv from 'dotenv';

// dotenv.config();

// // eslint-disable-next-line no-undef
// // Increase Jest's timeout to 20 seconds
// jest.setTimeout(20000);

// describe('Posts API', () => {
//   let server;
//   let token;

//   beforeAll(async () => {
//     // Connect to the database manually (since we're not using server.js)
//     await mongoose.connect(
//       'mongodb+srv://MuskaS:ZZolUuWxkqYxZeYo@diary.ycycy.mongodb.net/',
//       {
//         //useNewUrlParser: true,
//         //useUnifiedTopology: true,

//     });

//     // Start the server on an ephemeral port
//     server = app.listen(0);

//     // Log in to get the token
//     const res = await request(server)

//       .post('/api/user/login')
//       .send({
//         email: 'test@example.com',
//         password: 'Password@123',
//       })
//       .expect(200);

//     token = res.body.token;
//     expect(token).toBeDefined();
//   });

//   it('GET /api/posts should return an array of posts and validate for the presence of one uniquely created post', async () => {
//     const response = await request(server)
//       .get('/api/posts')
//       .set('Authorization', `Bearer ${token}`)

//       .expect(200);

//     console.log(response.body);

//     expect(response.body).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           location: null,
//           _id: '67d1d0ba6b4b64b478382fe2',
//           date: '2025-03-12T18:21:46.000Z',
//           title: "Pranav's only unique post",
//           content: '<p>Contains my current favorite video game: MARVEL RIVALS.</p>',
//           user_id: '67d0a258ae67602b68a70f3e',
//           mood: 'Excited',
//           password: null,
//           sharedWith: [],
//           tags: ['VidGame'],
//           createdAt: '2025-03-12T18:21:46.737Z',
//           updatedAt: '2025-03-12T18:21:46.737Z',
//           __v: 0,
//         }),
//       ])
//     );
//   });

//   it('ensures POST works by creating and posting a diary entry and validating through a GET', async () => {
//     const randomText = `Test Title #${Math.floor(Math.random() * 1000000)}`;
//     const newPost = {
//       title: randomText,
//       content: randomText,
//       mood: 'Sad',
//       date: new Date().toISOString(),
//       location: null, // Geotag disabled
//       password: null,
//     };

//     const postResponse = await request(server)

//       .post('/api/posts')
//       .set('Authorization', `Bearer ${token}`)
//       .send(newPost)
//       .set('Content-Type', 'application/json')
//       .expect(200);

//     expect(postResponse.body).toHaveProperty('_id');
//     expect(postResponse.body.title).toBe(randomText);
//     expect(postResponse.body.content).toBe(`${randomText}`);
//     expect(postResponse.body.mood).toBe('Sad');
//     expect(postResponse.body.location).toBeNull();

//     const getResponse = await request(server)
//       .get('/api/posts')
//       .set('Authorization', `Bearer ${token}`)
//       .expect(200);

//     // Find the newly created post by its _id
//     const foundPost = getResponse.body.find(
//       (post) => post._id === postResponse.body._id
//     );

//     expect(foundPost).toBeDefined();
//     expect(foundPost).toMatchObject({
//       _id: postResponse.body._id,
//       title: randomText,
//       content: `${randomText}`,
//       mood: 'Sad',
//       password: null,
//       location: null,
//     });
//   });


//   afterAll(async () => {
//     // Close the HTTP server

//     if (server) {

//     await new Promise((resolve, reject) => {
//       server.close((err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     });
//   }
//   await mongoose.connection.close();
// });

// });
