// backend_tests/api/postApi.test.js

import request from 'supertest';
import { app } from '../../server.js'; // Adjust path if needed

// eslint-disable-next-line no-undef
describe('Posts API', () => {
  let token;

  beforeAll(async () => {
    // 1) Log in to get the token
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'test@example.com',
        password: 'Password@123',
      })
      .expect(200);

    // 2) Store the token
    token = res.body.token;
    expect(token).toBeDefined();
  });
  // 1) GET scenario
  it('GET /api/posts should return an array of posts and validate for the presence of ONE uniquely created post', async () => {
    const response = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`) // 3) Pass token in header
      .expect(200);

    console.log(response.body);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          location: null,
          _id: '67d1d0ba6b4b64b478382fe2',
          date: '2025-03-12T18:21:46.000Z',
          title: "Pranav's only unique post",
          content:
            '<p>Contains my current favorite video game: MARVEL RIVALS.</p>',
          user_id: '67d0a258ae67602b68a70f3e',
          mood: 'Excited',
          password: null,
          sharedWith: [],
          tags: ['VidGame'],
          createdAt: '2025-03-12T18:21:46.737Z',
          updatedAt: '2025-03-12T18:21:46.737Z',
          __v: 0,
        }),
      ])
    );
  });
  it('ensures POST works by creating and posting a diary entry and validating through a GET', async () => {
    const randomText = `Test Title #${Math.floor(Math.random() * 1000000)}`;
    const newPost = {
      title: randomText,
      // Assuming your API wraps the content with <p> tags (as seen in your GET responses)
      content: randomText,
      mood: 'Sad',
      date: new Date().toISOString(),
      location: null, // Geotag disabled
      password: null,
    };
    const postResponse = await request(app)
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

    const getResponse = await request(app)
      .get('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Find the newly created post by its _id
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
});
