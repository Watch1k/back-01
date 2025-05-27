import { Router } from 'express';
import {
  getAllPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from './handlers';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  createPostValidation,
  updatePostValidation,
} from '../validation/post.validation';
import { adminGuardMiddleware } from '../../auth/middlewares/admin.guard-middleware';

export const postsRouter = Router({});

postsRouter
  .get('', getAllPostsHandler)
  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getPostByIdHandler,
  )
  .post(
    '',
    adminGuardMiddleware,
    createPostValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    '/:id',
    adminGuardMiddleware,
    idValidation,
    updatePostValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    '/:id',
    adminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
