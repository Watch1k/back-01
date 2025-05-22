import express, { Express, Request, Response } from 'express';
import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { videosRouter } from './videos/routers/videos.router';
import { setupSwagger } from './core/swagger/setup-swagger';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world2!!!');
  });

  app.use('/api/drivers', driversRouter);
  app.use('/api/videos', videosRouter);
  app.use('/api/testing', testingRouter);

  setupSwagger(app);
  return app;
};
