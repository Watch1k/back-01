import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs-repository';

const titleValidation = body('title')
  .exists()
  .withMessage('Invalid title. Max length is 30 characters.')
  .isString()
  .withMessage('Invalid title. Max length is 30 characters.')
  .isLength({ max: 30 })
  .withMessage('Invalid title. Max length is 30 characters.')
  .withMessage('Invalid title. Max length is 30 characters.')
  .trim()
  .notEmpty();

const shortDescriptionValidation = body('shortDescription')
  .exists()
  .withMessage('Invalid shortDescription. Max length is 100 characters.')
  .isString()
  .withMessage('Invalid shortDescription. Max length is 100 characters.')
  .isLength({ max: 100 })
  .withMessage('Invalid shortDescription. Max length is 100 characters.')
  .trim()
  .notEmpty()
  .withMessage('Invalid shortDescription. Max length is 100 characters.');

const contentValidation = body('content')
  .exists()
  .withMessage('Invalid content. Max length is 1000 characters.')
  .isString()
  .withMessage('Invalid content. Max length is 1000 characters.')
  .isLength({ max: 1000 })
  .withMessage('Invalid content. Max length is 1000 characters.')
  .trim()
  .notEmpty()
  .withMessage('Invalid content. Max length is 1000 characters.');

const blogIdValidation = body('blogId')
  .exists()
  .withMessage('Invalid blogId.')
  .isString()
  .withMessage('Invalid blogId.')
  .trim()
  .notEmpty()
  .withMessage('Invalid blogId.')
  .custom((value) => {
    const blog = blogsRepository.findBlog(value);
    if (!blog) {
      throw new Error('Blog not found');
    }
    return true;
  })
  .withMessage('Blog not found');

// Validation chains for different operations
export const createPostValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

export const updatePostValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
