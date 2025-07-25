import { Router, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import {
  blogsCollection,
  postsCollection,
  videoCollection,
} from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    videoCollection.deleteMany(),
    postsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
