import express, { Express, Request, Response } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { setupSwagger } from './core/swagger/setup-swagger';
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from './core/paths/paths';
import { blogsRoute } from './blogs/routes/blogs.route';
import { postsRoute } from './posts/routes/posts.route';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(404).send('hello world2!!!');
  });

  app.use(TESTING_PATH, testingRouter);
  app.use(BLOGS_PATH, blogsRoute);
  app.use(POSTS_PATH, postsRoute);

  setupSwagger(app);

  // Catch-all middleware for non-existent routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json('Not Found');
  });

  return app;
};
