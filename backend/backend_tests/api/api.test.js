// // backend_tests/api/postApi.test.js

// import request from 'supertest';
// import { app } from '../../server.js'; // Adjust path if needed

// describe('Posts API', () => {
//   let token;

//   beforeAll(async () => {
//     // Log in to get the token
//     const res = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: 'test@example.com',
//         password: 'Password@123',
//       })
//       .expect(200);

//     token = res.body.token;
//     expect(token).toBeDefined();
//   });

//   // GET scenario: Validate a known post exists in the response.
//   it('GET /api/posts should return an array of posts including a specific known entry', async () => {
//     const response = await request(app)
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

//   // POST scenario: Create a new post and then verify its details via GET.
//   it('POST /api/posts creates a new post and the GET /api/posts response includes it', async () => {
//     // Generate a unique title and random content
//     const randomTitle = `Test Title #${Math.floor(Math.random() * 1000000)}`;
//     const randomContent = `Random content #${Math.floor(Math.random() * 1000000)}`;

//     // Prepare the new post payload
//     const newPost = {
//       title: randomTitle,
//       // Assuming your API wraps the content with <p> tags (as seen in your GET responses)
//       content: randomContent,
//       mood: 'Sad',
//       date: new Date().toISOString(),
//       location: null, // Geotag disabled
//       password: 'supertest',
//     };

//     // POST the new post
//     const postResponse = await request(app)
//       .post('/api/posts')
//       .set('Authorization', `Bearer ${token}`)
//       .send(newPost)
//       .set('Content-Type', 'application/json')
//       .expect(201); // Adjust expected status if needed

//     // Validate the POST response
//     expect(postResponse.body).toHaveProperty('_id');
//     expect(postResponse.body.title).toBe(randomTitle);
//     // If your API wraps plain content in <p> tags, expect that:
//     expect(postResponse.body.content).toBe(`<p>${randomContent}</p>`);
//     expect(postResponse.body.mood).toBe('Sad');
//     expect(postResponse.body.password).toBe('supertest');
//     expect(postResponse.body.location).toBeNull();

//     // Now, GET all posts to verify the new post is included
//     const getResponse = await request(app)
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
//       title: randomTitle,
//       content: `<p>${randomContent}</p>`,
//       mood: 'Sad',
//       password: 'supertest',
//       location: null,
//     });

//     // "Clicking" the post is simulated here by finding it and validating its contents.
//     // In a real UI test, you'd simulate a user click to open the detailed view.
//   });
// });
