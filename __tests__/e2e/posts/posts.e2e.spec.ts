import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { stopDb } from '../../../src/db/mongo.db';
import { clearDb } from '../../utils/clear-db';
import { startDb } from '../../utils/start-db';
import { ObjectId } from 'mongodb';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';
import { PostAttributes } from '../../../src/posts/application/dtos/post-attributes';

describe('Post API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

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

  // Test post data
  const testPostData: Partial<PostAttributes> = {
    title: 'Test Post',
    shortDescription: 'Test Short Description',
    content: 'Test Content',
  };

  // Helper function to set up authentication for requests
  const authRequest = (
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
  ) => {
    return request(app)[method](path).set('Authorization', adminToken);
  };

  beforeAll(async () => {
    // Clear all data
    await authRequest('delete', '/api/testing/all-data').expect(
      HttpStatus.NoContent,
    );

    // Create a blog to use for posts
    const createBlogResponse = await authRequest('post', '/api/blogs')
      .send(testBlogData)
      .expect(HttpStatus.Created);

    blogId = createBlogResponse.body.id;
  });

  it('should return posts list; GET /api/posts', async () => {
    const newPost1: Partial<PostAttributes> = {
      ...testPostData,
      title: 'Test Post 1',
      blogId,
    };
    const newPost2: Partial<PostAttributes> = {
      ...testPostData,
      title: 'Test Post 2',
      blogId,
    };

    const createResponse1 = await authRequest('post', '/api/posts').send(
      newPost1,
    );
    expect(createResponse1.status).toBe(HttpStatus.Created);

    const createResponse2 = await authRequest('post', '/api/posts').send(
      newPost2,
    );
    expect(createResponse2.status).toBe(HttpStatus.Created);

    const postListResponse = await request(app).get('/api/posts');
    expect(postListResponse.status).toBe(HttpStatus.Ok);

    expect(postListResponse.body).toStrictEqual({
      items: [createResponse2.body, createResponse1.body],
      page: 1,
      pageCount: 1,
      pageSize: 10,
      totalCount: 2,
    });
  });

  it('should create post; POST /api/posts', async () => {
    const newPost: Partial<PostAttributes> = {
      ...testPostData,
      title: 'New Test Post',
      blogId,
    };

    const response = await authRequest('post', '/api/posts').send(newPost);
    expect(response.status).toBe(HttpStatus.Created);
    expect(response.body.title).toBe(newPost.title);
    expect(response.body.shortDescription).toBe(newPost.shortDescription);
    expect(response.body.content).toBe(newPost.content);
    expect(response.body.blogId).toBe(newPost.blogId);
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();
  });

  it('should return post by id; GET /api/posts/:id', async () => {
    const newPost: Partial<PostAttributes> = {
      ...testPostData,
      title: 'Test Post 3',
      blogId,
    };
    const createResponse = await authRequest('post', '/api/posts').send(
      newPost,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    const getResponse = await request(app).get(
      `/api/posts/${createResponse.body.id}`,
    );
    expect(getResponse.status).toBe(HttpStatus.Ok);

    expect(getResponse.body).toEqual(createResponse.body);
  });

  it('should update post; PUT /api/posts/:id', async () => {
    const newPost: Partial<PostAttributes> = {
      ...testPostData,
      title: 'Test Post 4',
      blogId,
    };
    const createResponse = await authRequest('post', '/api/posts').send(
      newPost,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    const postUpdateData: Partial<PostAttributes> = {
      title: 'Updated Post',
      shortDescription: 'Updated Short Description',
      content: 'Updated Content',
      blogId,
    };

    const updateResponse = await authRequest(
      'put',
      `/api/posts/${createResponse.body.id}`,
    ).send(postUpdateData);
    expect(updateResponse.status).toBe(HttpStatus.NoContent);

    const postResponse = await request(app).get(
      `/api/posts/${createResponse.body.id}`,
    );
    expect(postResponse.status).toBe(HttpStatus.Ok);

    expect(postResponse.body).toEqual({
      ...createResponse.body,
      ...postUpdateData,
    });
  });

  it('DELETE /api/posts/:id and check after NOT FOUND', async () => {
    const newPost: Partial<PostAttributes> = {
      ...testPostData,
      title: 'Test Post 5',
      blogId,
    };
    const createResponse = await authRequest('post', '/api/posts').send(
      newPost,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    const deleteResponse = await authRequest(
      'delete',
      `/api/posts/${createResponse.body.id}`,
    );
    expect(deleteResponse.status).toBe(HttpStatus.NoContent);

    const postResponse = await request(app).get(
      `/api/posts/${createResponse.body.id}`,
    );
    expect(postResponse.status).toBe(HttpStatus.NotFound);
  });

  it('should return 400 when creating a post with invalid data', async () => {
    // Missing required fields
    const invalidPost = {
      title: '', // Invalid title (too short)
    };

    const response = await authRequest('post', '/api/posts').send(invalidPost);
    expect(response.status).toBe(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 400 when updating a post with invalid data', async () => {
    // Create a valid post first
    const newPost: Partial<PostAttributes> = {
      ...testPostData,
      title: 'Test Post 6',
      blogId,
    };
    const createResponse = await authRequest('post', '/api/posts').send(
      newPost,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    // Try to update with invalid data
    const invalidUpdateData = {
      title: '', // Invalid title (too short)
    };

    const response = await authRequest(
      'put',
      `/api/posts/${createResponse.body.id}`,
    ).send(invalidUpdateData);
    expect(response.status).toBe(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 404 when getting a non-existent post', async () => {
    const nonExistentId = ObjectId.createFromTime(999999);
    const response = await request(app).get(`/api/posts/${nonExistentId}`);
    expect(response.status).toBe(HttpStatus.NotFound);

    // Check if the response has an error message
    expect(response.body).toBeDefined();
  });

  it('should return 404 when updating a non-existent post', async () => {
    const nonExistentId = ObjectId.createFromTime(999999);
    const updateData: Partial<PostAttributes> = {
      title: 'Updated Title',
      shortDescription: 'Updated Short Description',
      content: 'Updated Content',
      blogId,
    };

    const response = await authRequest(
      'put',
      `/api/posts/${nonExistentId}`,
    ).send(updateData);
    expect(response.status).toBe(HttpStatus.NotFound);

    // Check if the response has an error message
    expect(response.body).toBeDefined();
  });

  it('should return 404 when deleting a non-existent post', async () => {
    const nonExistentId = ObjectId.createFromTime(999999);
    const response = await authRequest('delete', `/api/posts/${nonExistentId}`);
    expect(response.status).toBe(HttpStatus.NotFound);

    // Check if the response has an error message
    expect(response.body).toBeDefined();
  });
});
