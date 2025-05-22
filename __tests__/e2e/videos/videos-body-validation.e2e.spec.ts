import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { VideoCreateInput } from '../../../src/videos/dto/video-create.input';
import { VideoResolution } from '../../../src/videos/types/video';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { ValidationError } from '../../../src/videos/types/validationError';

describe('Video API body validation check', () => {
  const app = express();
  setupApp(app);

  const correctVideoData: VideoCreateInput = {
    title: 'Test Video',
    author: 'Test Author',
    availableResolutions: [VideoResolution.Resolution144p],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HttpStatus.NoContent);
  });

  it('should not create video when title is invalid', async () => {
    // Empty title
    const emptyTitleResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        title: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);

    // Title too long (more than 40 characters)
    const longTitleResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        title: 'a'.repeat(41),
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
      .post('/api/videos')
      .send({
        ...correctVideoData,
        title: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);
  });

  it('should not create video when author is invalid', async () => {
    // Empty author
    const emptyAuthorResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        author: '',
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyAuthorResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyAuthorResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'author',
      ),
    ).toBe(true);

    // Author too long (more than 20 characters)
    const longAuthorResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        author: 'a'.repeat(21),
      })
      .expect(HttpStatus.BadRequest);

    expect(longAuthorResponse.body.errorsMessages).toBeDefined();
    expect(
      longAuthorResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'author',
      ),
    ).toBe(true);

    // Non-string author
    const nonStringAuthorResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        author: 123,
      })
      .expect(HttpStatus.BadRequest);

    expect(nonStringAuthorResponse.body.errorsMessages).toBeDefined();
    expect(
      nonStringAuthorResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'author',
      ),
    ).toBe(true);
  });

  it('should not create video when availableResolutions is invalid', async () => {
    // Empty availableResolutions
    const emptyResolutionsResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        availableResolutions: [],
      })
      .expect(HttpStatus.BadRequest);

    expect(emptyResolutionsResponse.body.errorsMessages).toBeDefined();
    expect(
      emptyResolutionsResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'availableResolutions',
      ),
    ).toBe(true);

    // Invalid resolution value
    const invalidResolutionResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        availableResolutions: ['InvalidResolution'],
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidResolutionResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidResolutionResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'availableResolutions',
      ),
    ).toBe(true);

    // Non-array availableResolutions
    const nonArrayResolutionsResponse = await request(app)
      .post('/api/videos')
      .send({
        ...correctVideoData,
        availableResolutions: 'P144',
      })
      .expect(HttpStatus.BadRequest);

    expect(nonArrayResolutionsResponse.body.errorsMessages).toBeDefined();
    expect(
      nonArrayResolutionsResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'availableResolutions',
      ),
    ).toBe(true);
  });

  it('should not update video when update data is invalid', async () => {
    // First create a valid video
    const createResponse = await request(app)
      .post('/api/videos')
      .send(correctVideoData)
      .expect(HttpStatus.Created);

    const videoId = createResponse.body.id;

    // Test invalid title
    const invalidTitleResponse = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: '',
        author: 'Updated Author',
        availableResolutions: [VideoResolution.Resolution720p],
        canBeDownloaded: true,
        minAgeRestriction: 16,
        publicationDate: new Date().toISOString(),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidTitleResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidTitleResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'title',
      ),
    ).toBe(true);

    // Test invalid author
    const invalidAuthorResponse = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: 'Updated Title',
        author: '',
        availableResolutions: [VideoResolution.Resolution720p],
        canBeDownloaded: true,
        minAgeRestriction: 16,
        publicationDate: new Date().toISOString(),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidAuthorResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidAuthorResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'author',
      ),
    ).toBe(true);

    // Test invalid availableResolutions
    const invalidResolutionsResponse = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: 'Updated Title',
        author: 'Updated Author',
        availableResolutions: [],
        canBeDownloaded: true,
        minAgeRestriction: 16,
        publicationDate: new Date().toISOString(),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidResolutionsResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidResolutionsResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'availableResolutions',
      ),
    ).toBe(true);

    // Test invalid canBeDownloaded
    const invalidCanBeDownloadedResponse = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: 'Updated Title',
        author: 'Updated Author',
        availableResolutions: [VideoResolution.Resolution720p],
        canBeDownloaded: 'yes', // Should be boolean
        minAgeRestriction: 16,
        publicationDate: new Date().toISOString(),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidCanBeDownloadedResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidCanBeDownloadedResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'canBeDownloaded',
      ),
    ).toBe(true);

    // Test invalid minAgeRestriction (below minimum)
    const invalidMinAgeResponse1 = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: 'Updated Title',
        author: 'Updated Author',
        availableResolutions: [VideoResolution.Resolution720p],
        canBeDownloaded: true,
        minAgeRestriction: 0, // Should be between 1 and 18
        publicationDate: new Date().toISOString(),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidMinAgeResponse1.body.errorsMessages).toBeDefined();
    expect(
      invalidMinAgeResponse1.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'minAgeRestriction',
      ),
    ).toBe(true);

    // Test invalid minAgeRestriction (above maximum)
    const invalidMinAgeResponse2 = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: 'Updated Title',
        author: 'Updated Author',
        availableResolutions: [VideoResolution.Resolution720p],
        canBeDownloaded: true,
        minAgeRestriction: 19, // Should be between 1 and 18
        publicationDate: new Date().toISOString(),
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidMinAgeResponse2.body.errorsMessages).toBeDefined();
    expect(
      invalidMinAgeResponse2.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'minAgeRestriction',
      ),
    ).toBe(true);

    // Test invalid publicationDate
    const invalidPublicationDateResponse = await request(app)
      .put(`/api/videos/${videoId}`)
      .send({
        title: 'Updated Title',
        author: 'Updated Author',
        availableResolutions: [VideoResolution.Resolution720p],
        canBeDownloaded: true,
        minAgeRestriction: 16,
        publicationDate: 'not-a-date',
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidPublicationDateResponse.body.errorsMessages).toBeDefined();
    expect(
      invalidPublicationDateResponse.body.errorsMessages.some(
        (e: ValidationError) => e.field === 'publicationDate',
      ),
    ).toBe(true);

    // Verify the video wasn't updated
    const getResponse = await request(app)
      .get(`/api/videos/${videoId}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body.title).toBe(correctVideoData.title);
    expect(getResponse.body.author).toBe(correctVideoData.author);
  });
});
