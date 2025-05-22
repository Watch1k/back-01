import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ResourceType } from '../../../src/core/types/resource-type';
import { VideoCategory } from '../../../src/videos/types/video';
import { VideoCreateInput } from '../../../src/videos/dto/video-create.input';
import { VideoUpdateInput } from '../../../src/videos/dto/video-update.input';

describe('Video API', () => {
  const app = express();
  setupApp(app);

  const testVideoData: VideoCreateInput['data'] = {
    type: ResourceType.Videos,
    attributes: {
      title: 'Test Video',
      description: 'This is a test video',
      url: 'https://example.com/videos/test-video',
      thumbnailUrl: 'https://example.com/thumbnails/test-video.jpg',
      duration: 120,
      category: VideoCategory.Education,
      tags: ['test', 'video', 'education'],
    },
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should create video; POST /api/videos', async () => {
    const newVideo: VideoCreateInput['data'] = {
      ...testVideoData,
      attributes: {
        ...testVideoData.attributes,
        title: 'New Test Video',
      },
    };

    await request(app)
      .post('/api/videos')
      .send({ data: newVideo })
      .expect(HttpStatus.Created);
  });

  it('should return videos list; GET /api/videos', async () => {
    const newVideo1: VideoCreateInput['data'] = {
      ...testVideoData,
      attributes: {
        ...testVideoData.attributes,
        title: 'Another Test Video 1',
      },
    };
    const newVideo2: VideoCreateInput['data'] = {
      ...testVideoData,
      attributes: {
        ...testVideoData.attributes,
        title: 'Another Test Video 2',
      },
    };
    await request(app)
      .post('/api/videos')
      .send({ data: newVideo1 })
      .expect(HttpStatus.Created);

    await request(app)
      .post('/api/videos')
      .send({ data: newVideo2 })
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get('/api/videos')
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return video by id; GET /api/videos/:id', async () => {
    const newVideo: VideoCreateInput['data'] = {
      ...testVideoData,
      attributes: {
        ...testVideoData.attributes,
        title: 'Another Test Video 3',
      },
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send({ data: newVideo })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/api/videos/${createResponse.body.data.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual(createResponse.body);
  });

  it('should update video; PUT /api/videos/:id', async () => {
    const newVideo: VideoCreateInput['data'] = {
      ...testVideoData,
      attributes: {
        ...testVideoData.attributes,
        title: 'Another Test Video 4',
      },
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send({ data: newVideo })
      .expect(HttpStatus.Created);

    const videoUpdateData: VideoUpdateInput = {
      data: {
        type: ResourceType.Videos,
        attributes: {
          title: 'Updated Video Title',
          description: 'Updated video description',
          url: 'https://example.com/videos/updated-video',
          thumbnailUrl: 'https://example.com/thumbnails/updated-video.jpg',
          duration: 180,
          category: VideoCategory.Entertainment,
          tags: ['updated', 'video', 'entertainment'],
        },
      },
    };

    await request(app)
      .put(`/api/videos/${createResponse.body.data.id}`)
      .send(videoUpdateData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/api/videos/${createResponse.body.data.id}`,
    );

    expect(videoResponse.body.data).toEqual({
      ...videoUpdateData.data,
      id: createResponse.body.data.id,
    });
  });

  it('DELETE /api/videos/:id and check after NOT FOUND', async () => {
    const newVideo: VideoCreateInput['data'] = {
      ...testVideoData,
      attributes: {
        ...testVideoData.attributes,
        title: 'Another Test Video 5',
      },
    };
    const createResponse = await request(app)
      .post('/api/videos')
      .send({ data: newVideo })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/api/videos/${createResponse.body.data.id}`)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/api/videos/${createResponse.body.data.id}`,
    );
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });
});
