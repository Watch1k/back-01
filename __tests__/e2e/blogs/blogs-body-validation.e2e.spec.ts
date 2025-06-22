import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { BlogCreateInput } from '../../../src/blogs/dto/blog-create.input';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ValidationError } from '../../../src/core/types/validationError';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { stopDb } from '../../../src/db/mongo.db';
import { clearDb } from '../../utils/clear-db';
import { startDb } from '../../utils/start-db';

describe('Blog API body validation check', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await startDb();
    await clearDb(app);
  });

  afterAll(async () => {
    await clearDb(app);
    await stopDb();
  });

  const correctBlogData: BlogCreateInput = {
    name: 'Test Blog',
    description: 'Test Description',
    websiteUrl: 'https://test-blog.com',
  };

  const authHeader = generateBasicAuthToken();

  it('should not create blog when name is invalid', async () => {
    // Name with only whitespaces
    const whitespaceNameResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        name: '    ',
      })
      .expect(HttpStatus.BadRequest);

    expect(whitespaceNameResponse.body.errorsMessages).toBeDefined();
    expect(
      whitespaceNameResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'name',
      ),
    ).toBe(true);

    // Empty name
    const emptyNameResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        name: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyNameResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyNameResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'name',
      ),
    ).toBe(true);

    // Name too long (more than 15 characters)
    const longNameResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        name: 'a'.repeat(16),
      })
      .expect(HttpStatus.BadRequest);

    expect(longNameResponse.body.errorsMessages).toBeDefined();
    expect(
      longNameResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'name',
      ),
    ).toBe(true);

    // Non-string name
    const nonStringNameResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        name: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringNameResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringNameResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'name',
      ),
    ).toBe(true);
  });

  it('should not create blog when description is invalid', async () => {
    // Description with only whitespaces
    const whitespaceDescriptionResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        description: '    ',
      })
      .expect(HttpStatus.BadRequest);

    expect(whitespaceDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      whitespaceDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'description',
      ),
    ).toBe(true);

    // Empty description
    const emptyDescriptionResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        description: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'description',
      ),
    ).toBe(true);

    // Description too long (more than 500 characters)
    const longDescriptionResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        description: 'a'.repeat(501),
      })
      .expect(HttpStatus.BadRequest);

    expect(longDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      longDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'description',
      ),
    ).toBe(true);

    // Non-string description
    const nonStringDescriptionResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        description: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'description',
      ),
    ).toBe(true);
  });

  it('should not create blog when websiteUrl is invalid', async () => {
    // WebsiteUrl with only whitespaces
    const whitespaceWebsiteUrlResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        websiteUrl: '    ',
      })
      .expect(HttpStatus.BadRequest);

    expect(whitespaceWebsiteUrlResponse.body.errorsMessages).toBeDefined();
    expect(
      whitespaceWebsiteUrlResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'websiteUrl',
      ),
    ).toBe(true);

    // Empty websiteUrl
    const emptyWebsiteUrlResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        websiteUrl: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyWebsiteUrlResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyWebsiteUrlResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'websiteUrl',
      ),
    ).toBe(true);

    // WebsiteUrl too long (more than 100 characters)
    const longWebsiteUrlResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        websiteUrl: `https://${'a'.repeat(90)}.com`,
      })
      .expect(HttpStatus.BadRequest);

    expect(longWebsiteUrlResponse.body.errorsMessages).toBeDefined();
    expect(
      longWebsiteUrlResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'websiteUrl',
      ),
    ).toBe(true);

    // Non-string websiteUrl
    const nonStringWebsiteUrlResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        websiteUrl: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringWebsiteUrlResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringWebsiteUrlResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'websiteUrl',
      ),
    ).toBe(true);

    // Invalid websiteUrl format (not matching regex)
    const invalidFormatWebsiteUrlResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send({
        ...correctBlogData,
        websiteUrl: 'http://invalid-url',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidFormatWebsiteUrlResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidFormatWebsiteUrlResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'websiteUrl',
      ),
    ).toBe(true);
  });

  it('should not update blog when update data is invalid', async () => {
    // First, create a valid blog
    const createResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(correctBlogData)
      .expect(HttpStatus.Created);

    const blogId = createResponse.body.id;

    // Test invalid name
    const invalidNameResponse = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', authHeader)
      .send({
        name: '',
        description: 'Updated Description',
        websiteUrl: 'https://updated-blog.com',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidNameResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidNameResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'name',
      ),
    ).toBe(true);

    // Test invalid description
    const invalidDescriptionResponse = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', authHeader)
      .send({
        name: 'Updated Name',
        description: '',
        websiteUrl: 'https://updated-blog.com',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'description',
      ),
    ).toBe(true);

    // Test invalid websiteUrl
    const invalidWebsiteUrlResponse = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', authHeader)
      .send({
        name: 'Updated Name',
        description: 'Updated Description',
        websiteUrl: 'invalid-url',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidWebsiteUrlResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidWebsiteUrlResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'websiteUrl',
      ),
    ).toBe(true);

    // Verify the blog wasn't updated
    const getResponse = await request(app)
      .get(`/api/blogs/${blogId}`)
      .set('Authorization', authHeader)
      .expect(HttpStatus.Ok);

    expect(getResponse.body.name).toBe(correctBlogData.name);
    expect(getResponse.body.description).toBe(correctBlogData.description);
    expect(getResponse.body.websiteUrl).toBe(correctBlogData.websiteUrl);
  });
});
