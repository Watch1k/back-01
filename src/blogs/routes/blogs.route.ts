import { Router } from 'express';
import {
  getAllBlogsHandler,
  getBlogByIdHandler,
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
  createPostByBlogIdHandler,
} from './handlers';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validtion-result.middleware';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import {
  createBlogValidation,
  updateBlogValidation,
} from '../validation/blog.validation';
import { adminGuardMiddleware } from '../../auth/middlewares/admin.guard-middleware';
import { getPostsByBlogIdHandler } from './handlers/getPostsByBlogId.handler';
import { createPostByBlogIdValidation } from '../../posts/validation/post.validation';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation-middleware';
import { PostSortField } from '../../posts/routes/input/post-sort-field';
import { BlogSortField } from './input/blog-sort-field';

export const blogsRoute = Router({});

blogsRoute
  .get(
    '',
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    getAllBlogsHandler,
  )
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
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostsByBlogIdHandler,
  )
  .post(
    '/:id/posts',
    adminGuardMiddleware,
    idValidation,
    createPostByBlogIdValidation,
    inputValidationResultMiddleware,
    createPostByBlogIdHandler,
  );
