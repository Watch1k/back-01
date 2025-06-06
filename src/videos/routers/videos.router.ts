import { Router } from 'express';
import {
  getAllVideosHandler,
  getVideoByIdHandler,
  createVideoHandler,
  updateVideoHandler,
  deleteVideoHandler,
} from './handlers';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  createVideoValidation,
  updateVideoValidation,
} from '../validation/video.validation';
import { adminGuardMiddleware } from '../../auth/middlewares/admin.guard-middleware';

export const videosRouter = Router({});

videosRouter
  .get('', getAllVideosHandler)
  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getVideoByIdHandler,
  )
  .post(
    '',
    adminGuardMiddleware,
    createVideoValidation,
    inputValidationResultMiddleware,
    createVideoHandler,
  )
  .put(
    '/:id',
    adminGuardMiddleware,
    idValidation,
    updateVideoValidation,
    inputValidationResultMiddleware,
    updateVideoHandler,
  )
  .delete(
    '/:id',
    adminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteVideoHandler,
  );
