import { Router } from 'express';
import {
  getAllVideosHandler,
  getVideoByIdHandler,
  createVideoHandler,
  updateVideoHandler,
  deleteVideoHandler,
} from './handlers';

export const videosRouter = Router({});

videosRouter
  .get('', getAllVideosHandler)
  .get('/:id', getVideoByIdHandler)
  .post('', createVideoHandler)
  .put('/:id', updateVideoHandler)
  .delete('/:id', deleteVideoHandler);
