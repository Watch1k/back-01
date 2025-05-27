import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';

describe('Non-existent routes', () => {
  const app = express();
  setupApp(app);

  it('should return 404 when accessing a non-existent route', async () => {
    const response = await request(app)
      .get('/non-existent-route')
      .expect(HttpStatus.NotFound);

    expect(response.body).toBe('Not Found');
  });

  it('should return 404 when accessing a non-existent API route', async () => {
    const response = await request(app)
      .get('/api/non-existent-resource')
      .expect(HttpStatus.NotFound);

    expect(response.body).toBe('Not Found');
  });

  it('should return 404 when using POST on a non-existent route', async () => {
    const response = await request(app)
      .post('/api/non-existent-resource')
      .send({ some: 'data' })
      .expect(HttpStatus.NotFound);

    expect(response.body).toBe('Not Found');
  });
});