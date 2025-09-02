import { Router } from 'express';
import {
  getAllPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from './handlers';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  createPostValidation,
  updatePostValidation,
} from '../validation/post.validation';
import { adminGuardMiddleware } from '../../auth/middlewares/admin.guard-middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from './input/post-sort-field';

export const postsRoute = Router({});

postsRoute
  .get(
    '',
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getAllPostsHandler,
  )
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
