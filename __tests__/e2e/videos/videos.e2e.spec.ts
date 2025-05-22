import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { VideoResolution } from '../../../src/videos/types/video';
import { VideoCreateInput } from '../../../src/videos/dto/video-create.input';
import { VideoUpdateInput } from '../../../src/videos/dto/video-update.input';

describe('Video API', () => {
  const app = express();
  setupApp(app);

  const testVideoData: VideoCreateInput = {
    title: 'Test Video',
    author: 'Test Author',
    availableResolutions: [VideoResolution.Resolution144p],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create video; POST /api/videos', async () => {
    const newVideo: VideoCreateInput = {
      ...testVideoData,
      title: 'New Test Video',
    };

    await request(app)
      .post('/api/videos')
      .send(newVideo)
      .expect(HttpStatus.Created);
  });

  it('should return videos list; GET /api/videos', async () => {
    const newVideo1: VideoCreateInput = {
      ...testVideoData,
      title: 'Another Test Video 1',
    };
    const newVideo2: VideoCreateInput = {
      ...testVideoData,
      title: 'Another Test Video 2',
    };
    await request(app)
      .post('/api/videos')
      .send(newVideo1)
      .expect(HttpStatus.Created);

    await request(app)
      .post('/api/videos')
      .send(newVideo2)
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get('/api/videos')
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return video by id; GET /api/videos/:id', async () => {
    const newVideo: VideoCreateInput = {
      ...testVideoData,
      title: 'Another Test Video 3',
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send(newVideo)
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual(createResponse.body);
  });

  it('should update video; PUT /api/videos/:id', async () => {
    const newVideo: VideoCreateInput = {
      ...testVideoData,
      title: 'Another Test Video 4',
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send(newVideo)
      .expect(HttpStatus.Created);

    const videoUpdateData: VideoUpdateInput = {
      title: 'Updated Video Title',
      author: 'Updated Author',
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date(
        new Date().getTime() + 48 * 60 * 60 * 1000,
      ).toISOString(),
      availableResolutions: [
        VideoResolution.Resolution720p,
        VideoResolution.Resolution1080p,
      ],
    };

    await request(app)
      .put(`/api/videos/${createResponse.body.id}`)
      .send(videoUpdateData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/api/videos/${createResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...videoUpdateData,
      id: createResponse.body.id,
      createdAt: createResponse.body.createdAt,
    });
  });

  it('DELETE /api/videos/:id and check after NOT FOUND', async () => {
    const newVideo: VideoCreateInput = {
      ...testVideoData,
      title: 'Another Test Video 5',
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send(newVideo)
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/api/videos/${createResponse.body.id}`)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/api/videos/${createResponse.body.id}`,
    );
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });

  it('should return 400 when creating a video with invalid data', async () => {
    // Missing required fields
    const invalidVideo = {
      title: '', // Invalid title (too short)
    };

    const response = await request(app)
      .post('/api/videos')
      .send(invalidVideo)
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 400 when updating a video with invalid data', async () => {
    // Create a valid video first
    const newVideo: VideoCreateInput = {
      ...testVideoData,
      title: 'Video for Invalid Update Test',
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send(newVideo)
      .expect(HttpStatus.Created);

    // Try to update with invalid data
    const invalidUpdateData = {
      title: '', // Invalid title (too short)
    };

    const response = await request(app)
      .put(`/api/videos/${createResponse.body.id}`)
      .send(invalidUpdateData)
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 404 when getting a non-existent video', async () => {
    const nonExistentId = 999999;
    const response = await request(app)
      .get(`/api/videos/${nonExistentId}`)
      .expect(HttpStatus.NotFound);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 404 when updating a non-existent video', async () => {
    const nonExistentId = 999999;
    const updateData: VideoUpdateInput = {
      title: 'Updated Title',
      author: 'Updated Author',
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
      availableResolutions: [VideoResolution.Resolution720p],
    };

    const response = await request(app)
      .put(`/api/videos/${nonExistentId}`)
      .send(updateData)
      .expect(HttpStatus.NotFound);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });

  it('should return 404 when deleting a non-existent video', async () => {
    const nonExistentId = 999999;
    const response = await request(app)
      .delete(`/api/videos/${nonExistentId}`)
      .expect(HttpStatus.NotFound);

    expect(response.body.errorsMessages).toBeDefined();
    expect(response.body.errorsMessages.length).toBeGreaterThan(0);
  });
});
