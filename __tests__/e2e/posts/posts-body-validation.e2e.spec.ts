import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { ValidationError } from '../../../src/core/types/validationError';
import { clearDb } from '../../utils/clear-db';
import { stopDb } from '../../../src/db/mongo.db';
import { startDb } from '../../utils/start-db';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';

describe('Post API body validation check', () => {
  const app = express();
  setupApp(app);

  let blogId: string;

  beforeAll(async () => {
    await startDb();
    await clearDb(app);
  });

  afterAll(async () => {
    await clearDb(app);
    await stopDb();
  });

  // Test blog data to create a blog for posts
  const testBlogData: BlogAttributes = {
    name: 'Test Blog',
    description: 'Test Description',
    websiteUrl: 'https://test-blog.com',
  };

  // Correct post data
  const correctPostData: Omit<PostAttributes, 'blogId'> = {
    title: 'Test Post',
    shortDescription: 'Test Short Description',
    content: 'Test Content',
  };

  const authHeader = generateBasicAuthToken();

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);

    // Create a blog to use for posts
    const createBlogResponse = await request(app)
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(testBlogData)
      .expect(HttpStatus.Created);

    blogId = createBlogResponse.body.id;
  });

  it('should not create post when title is invalid', async () => {
    // Empty title
    const emptyTitleResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        title: '     ',
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);

    // Title too long (more than 30 characters)
    const longTitleResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        title: 'a'.repeat(31),
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(longTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      longTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);

    // Non-string title
    const nonStringTitleResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        title: 123,
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);
  });

  it('should not create post when shortDescription is invalid', async () => {
    // Empty shortDescription
    const emptyShortDescriptionResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        shortDescription: '',
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyShortDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyShortDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'shortDescription',
      ),
    ).toBe(true);

    // ShortDescription too long (more than 100 characters)
    const longShortDescriptionResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        shortDescription: 'a'.repeat(101),
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(longShortDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      longShortDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'shortDescription',
      ),
    ).toBe(true);

    // Non-string shortDescription
    const nonStringShortDescriptionResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        shortDescription: 123,
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringShortDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringShortDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'shortDescription',
      ),
    ).toBe(true);
  });

  it('should not create post when content is invalid', async () => {
    // Empty content
    const emptyContentResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        content: '',
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyContentResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyContentResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'content',
      ),
    ).toBe(true);

    // Content too long (more than 1000 characters)
    const longContentResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        content: 'a'.repeat(1001),
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(longContentResponse.body.errorsMessages).toBeDefined();
    expect(
      longContentResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'content',
      ),
    ).toBe(true);

    // Non-string content
    const nonStringContentResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        content: 123,
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringContentResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringContentResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'content',
      ),
    ).toBe(true);
  });

  it('should not create post when blogId is invalid', async () => {
    // Empty blogId
    const emptyBlogIdResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        blogId: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyBlogIdResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyBlogIdResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'blogId',
      ),
    ).toBe(true);

    // Non-string blogId
    const nonStringBlogIdResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        blogId: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringBlogIdResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringBlogIdResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'blogId',
      ),
    ).toBe(true);

    // Non-existent blogId
    const nonExistentBlogIdResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        blogId: '999999',
      })
      .expect(HttpStatus.BadRequest);

    expect(nonExistentBlogIdResponse.body.errorsMessages).toBeDefined();
    expect(
      nonExistentBlogIdResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'blogId',
      ),
    ).toBe(true);
  });

  it('should not update post when update data is invalid', async () => {
    // First, create a valid post
    const createResponse = await request(app)
      .post('/api/posts')
      .set('Authorization', authHeader)
      .send({
        ...correctPostData,
        blogId,
      })
      .expect(HttpStatus.Created);

    const postId = createResponse.body.id;

    // Test invalid title
    const invalidTitleResponse = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', authHeader)
      .send({
        title: '',
        shortDescription: 'Updated Short Description',
        content: 'Updated Content',
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);

    // Test invalid shortDescription
    const invalidShortDescriptionResponse = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', authHeader)
      .send({
        title: 'Updated Title',
        shortDescription: '',
        content: 'Updated Content',
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidShortDescriptionResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidShortDescriptionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'shortDescription',
      ),
    ).toBe(true);

    // // Test invalid content
    const invalidContentResponse = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', authHeader)
      .send({
        title: 'Updated Title',
        shortDescription: 'Updated Short Description',
        content: '',
        blogId,
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidContentResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidContentResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'content',
      ),
    ).toBe(true);

    // Test invalid blogId
    const invalidBlogIdResponse = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', authHeader)
      .send({
        title: 'Updated Title',
        shortDescription: 'Updated Short Description',
        content: 'Updated Content',
        blogId: '999999',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidBlogIdResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidBlogIdResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'blogId',
      ),
    ).toBe(true);

    // Verify the post wasn't updated
    const getResponse = await request(app)
      .get(`/api/posts/${postId}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body.title).toBe(correctPostData.title);
    expect(getResponse.body.shortDescription).toBe(
      correctPostData.shortDescription,
    );
    expect(getResponse.body.content).toBe(correctPostData.content);
    expect(getResponse.body.blogId).toBe(blogId);
  });
});
