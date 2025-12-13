const request = require('supertest');
const app = require('../src/server');

require('./setup');

describe('User Service API', () => {

  it('should return service health', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.service).toBe('user-service');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'john@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('john@mail.com');
  });

  it('should not allow duplicate email', async () => {
    await request(app)
      .post('/users/register')
      .send({
        name: 'User One',
        email: 'dup@mail.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/users/register')
      .send({
        name: 'User Two',
        email: 'dup@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(409);
  });

  it('should login user and return token', async () => {
    await request(app)
      .post('/users/register')
      .send({
        name: 'Login User',
        email: 'login@mail.com',
        password: '123456'
      });

    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'login@mail.com',
        password: '123456'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should verify token', async () => {
    await request(app)
      .post('/users/register')
      .send({
        name: 'Verify User',
        email: 'verify@mail.com',
        password: '123456'
      });

    const login = await request(app)
      .post('/users/login')
      .send({
        email: 'verify@mail.com',
        password: '123456'
      });

    const token = login.body.token;

    const res = await request(app)
      .post('/users/verify')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('verify@mail.com');
  });

});
