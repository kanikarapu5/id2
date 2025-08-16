const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const users = require('../routes/users');
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/users', users);

describe('User Routes', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1/test-db`;
    await mongoose.connect(url, { useNewUrlParser: true });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'Institution',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Test User');
  });
});
