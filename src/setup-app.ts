import express, { Express, Request, Response } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { videosRouter } from './videos/routers/videos.router';
import { setupSwagger } from './core/swagger/setup-swagger';
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH, VIDEOS_PATH } from './core/paths/paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { postsRouter } from './posts/routers/posts.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(404).send('hello world2!!!');
  });

  app.use(VIDEOS_PATH, videosRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);

  setupSwagger(app);

  // Catch-all middleware for non-existent routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json('Not Found');
  });

  return app;
};
