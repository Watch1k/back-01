import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs-repository';

const titleValidation = body('title')
  .exists()
  .isString()
  .isLength({ max: 30 })
  .trim()
  .notEmpty()
  .withMessage('Invalid title. Max length is 30 characters.');

const shortDescriptionValidation = body('shortDescription')
  .exists()
  .isString()
  .isLength({ max: 100 })
  .trim()
  .notEmpty()
  .withMessage('Invalid shortDescription. Max length is 100 characters.');

const contentValidation = body('content')
  .exists()
  .isString()
  .isLength({ max: 1000 })
  .trim()
  .notEmpty()
  .withMessage('Invalid content. Max length is 1000 characters.');

const blogIdValidation = body('blogId')
  .exists()
  .isString()
  .trim()
  .notEmpty()
  .isMongoId()
  .withMessage('Invalid blogId.')
  .bail()
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
