import express, { Express, Request, Response } from 'express';
import { testingRouter } from './testing/routers/testing.router';
import { videosRouter } from './videos/routers/videos.router';
import { setupSwagger } from './core/swagger/setup-swagger';
import { TESTING_PATH, VIDEOS_PATH } from './core/paths/paths';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world2!!!');
  });

  app.use(VIDEOS_PATH, videosRouter);
  app.use(TESTING_PATH, testingRouter);

  setupSwagger(app);
  return app;
};
