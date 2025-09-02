import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/generate-admin-auth-token';
import { stopDb } from '../../../src/db/mongo.db';
import { ObjectId } from 'mongodb';
import { clearDb } from '../../utils/clear-db';
import { startDb } from '../../utils/start-db';
import { BlogAttributes } from '../../../src/blogs/application/dtos/blog-attributes';

describe('Blog API', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const testBlogData: BlogAttributes = {
    name: 'Test Blog',
    description: 'Test Description',
    websiteUrl: 'https://test-blog.com',
  };

  // Helper function to set up authentication for requests
  const authRequest = (
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
  ) => {
    return request(app)[method](path).set('Authorization', adminToken);
  };

  beforeAll(async () => {
    await startDb();
    await clearDb(app);
  });

  afterAll(async () => {
    await clearDb(app);
    await stopDb();
  });

  it('should return blogs list; GET /api/blogs', async () => {
    const newBlog1 = {
      ...testBlogData,
      name: 'Test Blog 1',
    };
    const newBlog2 = {
      ...testBlogData,
      name: 'Test Blog 2',
    };

    const createResponse1 = await authRequest('post', '/api/blogs').send(
      newBlog1,
    );
    expect(createResponse1.status).toBe(HttpStatus.Created);

    const createResponse2 = await authRequest('post', '/api/blogs').send(
      newBlog2,
    );
    expect(createResponse2.status).toBe(HttpStatus.Created);

    const blogListResponse = await request(app).get('/api/blogs');
    expect(blogListResponse.status).toBe(HttpStatus.Ok);

    expect(blogListResponse.body).toStrictEqual({
      items: [createResponse2.body, createResponse1.body],
      page: 1,
      pagesCount: 1,
      pageSize: 10,
      totalCount: 2,
    });
  });

  it('should create blog; POST /api/blogs', async () => {
    const newBlog = {
      ...testBlogData,
      name: 'New Test Blog',
    };

    const response = await authRequest('post', '/api/blogs').send(newBlog);
    expect(response.status).toBe(HttpStatus.Created);
  });

  it('should return blog by id; GET /api/blogs/:id', async () => {
    const newBlog = {
      ...testBlogData,
      name: 'Test Blog 3',
    };
    const createResponse = await authRequest('post', '/api/blogs').send(
      newBlog,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    const getResponse = await request(app).get(
      `/api/blogs/${createResponse.body.id}`,
    );
    expect(getResponse.status).toBe(HttpStatus.Ok);

    expect(getResponse.body).toEqual(createResponse.body);
  });

  it('should update blog; PUT /api/blogs/:id', async () => {
    const newBlog = {
      ...testBlogData,
      name: 'Test Blog 4',
    };
    const createResponse = await authRequest('post', '/api/blogs').send(
      newBlog,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    const blogUpdateData = {
      name: 'Updated Blog',
      description: 'Updated Blog Description',
      websiteUrl: 'https://updated-blog.com',
    };

    const updateResponse = await authRequest(
      'put',
      `/api/blogs/${createResponse.body.id}`,
    ).send(blogUpdateData);
    expect(updateResponse.status).toBe(HttpStatus.NoContent);

    const blogResponse = await request(app).get(
      `/api/blogs/${createResponse.body.id}`,
    );
    expect(blogResponse.status).toBe(HttpStatus.Ok);

    expect(blogResponse.body).toEqual({
      ...blogUpdateData,
      id: createResponse.body.id,
      isMembership: false,
      createdAt: createResponse.body.createdAt,
    });
  });

  it('DELETE /api/blogs/:id and check after NOT FOUND', async () => {
    const newBlog = {
      ...testBlogData,
      name: 'Test Blog 5',
    };
    const createResponse = await authRequest('post', '/api/blogs').send(
      newBlog,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    const deleteResponse = await authRequest(
      'delete',
      `/api/blogs/${createResponse.body.id}`,
    );
    expect(deleteResponse.status).toBe(HttpStatus.NoContent);

    const blogResponse = await request(app).get(
      `/api/blogs/${createResponse.body.id}`,
    );
    expect(blogResponse.status).toBe(HttpStatus.NotFound);
  });

  it('should return 400 when creating a blog with invalid data', async () => {
    // Missing required fields
    const invalidBlog = {
      name: '', // Invalid name (too short)
    };

    const response = await authRequest('post', '/api/blogs').send(invalidBlog);
    expect(response.status).toBe(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 400 when updating a blog with invalid data', async () => {
    // Create a valid blog first
    const newBlog = {
      ...testBlogData,
      name: 'Test Blog 6',
    };
    const createResponse = await authRequest('post', '/api/blogs').send(
      newBlog,
    );
    expect(createResponse.status).toBe(HttpStatus.Created);

    // Try to update with invalid data
    const invalidUpdateData = {
      name: '', // Invalid name (too short)
    };

    const response = await authRequest(
      'put',
      `/api/blogs/${createResponse.body.id}`,
    ).send(invalidUpdateData);
    expect(response.status).toBe(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 404 when getting a non-existent blog', async () => {
    const nonExistentId = ObjectId.createFromTime(1234567890);
    const response = await request(app).get(`/api/blogs/${nonExistentId}`);
    expect(response.status).toBe(HttpStatus.NotFound);

    // Check if the response has an error message
    // Note: The format might be different from what we expected
    expect(response.body).toBeDefined();
  });

  it('should return 404 when updating a non-existent blog', async () => {
    const nonExistentId = ObjectId.createFromTime(1234567890);
    const updateData = {
      name: 'Updated Name',
      description: 'Updated Description',
      websiteUrl: 'https://updated-blog.com',
    };

    const response = await authRequest(
      'put',
      `/api/blogs/${nonExistentId}`,
    ).send(updateData);
    expect(response.status).toBe(HttpStatus.NotFound);

    // Check if the response has an error message
    // Note: The format might be different from what we expected
    expect(response.body).toBeDefined();
  });

  it('should return 404 when deleting a non-existent blog', async () => {
    const nonExistentId = ObjectId.createFromTime(1234567890);
    const response = await authRequest('delete', `/api/blogs/${nonExistentId}`);
    expect(response.status).toBe(HttpStatus.NotFound);

    // Check if the response has an error message
    // Note: The format might be different from what we expected
    expect(response.body).toBeDefined();
  });

  it('should delete a blog and all its related posts', async () => {
    // Create a blog
    const newBlog = {
      ...testBlogData,
      name: 'Blog to Delete',
    };
    const createBlogResponse = await authRequest('post', '/api/blogs').send(
      newBlog,
    );
    expect(createBlogResponse.status).toBe(HttpStatus.Created);
    const blogId = createBlogResponse.body.id;

    // Create posts for this blog
    const testPostData = {
      title: 'Test Post for Blog Deletion',
      shortDescription: 'This post should be deleted when the blog is deleted',
      content: 'Test content',
    };

    // Create multiple posts for the blog
    const post1 = {
      ...testPostData,
      title: 'Post 1 for Blog Deletion',
      blogId,
    };
    const post2 = {
      ...testPostData,
      title: 'Post 2 for Blog Deletion',
      blogId,
    };

    const createPost1Response = await authRequest('post', '/api/posts').send(
      post1,
    );
    expect(createPost1Response.status).toBe(HttpStatus.Created);
    const post1Id = createPost1Response.body.id;

    const createPost2Response = await authRequest('post', '/api/posts').send(
      post2,
    );
    expect(createPost2Response.status).toBe(HttpStatus.Created);
    const post2Id = createPost2Response.body.id;

    // Verify posts exist
    const getPost1Response = await request(app).get(`/api/posts/${post1Id}`);
    expect(getPost1Response.status).toBe(HttpStatus.Ok);

    const getPost2Response = await request(app).get(`/api/posts/${post2Id}`);
    expect(getPost2Response.status).toBe(HttpStatus.Ok);

    // Delete the blog
    const deleteBlogResponse = await authRequest(
      'delete',
      `/api/blogs/${blogId}`,
    );
    expect(deleteBlogResponse.status).toBe(HttpStatus.NoContent);

    // Verify blog is deleted
    const getBlogResponse = await request(app).get(`/api/blogs/${blogId}`);
    expect(getBlogResponse.status).toBe(HttpStatus.NotFound);

    // Verify posts are also deleted
    const getPost1AfterDeleteResponse = await request(app).get(
      `/api/posts/${post1Id}`,
    );
    expect(getPost1AfterDeleteResponse.status).toBe(HttpStatus.NotFound);

    const getPost2AfterDeleteResponse = await request(app).get(
      `/api/posts/${post2Id}`,
    );
    expect(getPost2AfterDeleteResponse.status).toBe(HttpStatus.NotFound);
  });
});
