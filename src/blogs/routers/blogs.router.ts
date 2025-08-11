import { Router } from 'express';
import {
  getAllBlogsHandler,
  getBlogByIdHandler,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
} from './handlers';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  createBlogValidation,
  updateBlogValidation,
} from '../validation/blog.validation';
import { adminGuardMiddleware } from '../../auth/middlewares/admin.guard-middleware';
import { getPostsByBlogIdHandler } from './handlers/getPostsByBlogId.handler';

export const blogsRouter = Router({});

blogsRouter
  .get('', getAllBlogsHandler)
  .get(
    '/:id',
    idValidation,
    inputValidationResultMiddleware,
    getBlogByIdHandler,
  )
  .post(
    '',
    adminGuardMiddleware,
    createBlogValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .put(
    '/:id',
    adminGuardMiddleware,
    idValidation,
    updateBlogValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    '/:id',
    adminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )
  .get(
    '/:id/posts',
    idValidation,
    inputValidationResultMiddleware,
    getPostsByBlogIdHandler,
  )
  .post(
    '/:id/posts',
    adminGuardMiddleware,
    createBlogValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  );
