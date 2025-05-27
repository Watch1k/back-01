import { body } from 'express-validator';

const nameValidation = body('name')
  .exists()
  .withMessage('Invalid name. Max length is 15 characters.')
  .isString()
  .withMessage('Invalid name. Max length is 15 characters.')
  .notEmpty()
  .withMessage('Invalid name. Max length is 15 characters.')
  .isLength({ max: 15 })
  .withMessage('Invalid name. Max length is 15 characters.');

const descriptionValidation = body('description')
  .exists()
  .withMessage('Invalid description. Max length is 500 characters.')
  .isString()
  .withMessage('Invalid description. Max length is 500 characters.')
  .notEmpty()
  .withMessage('Invalid description. Max length is 500 characters.')
  .isLength({ max: 500 })
  .withMessage('Invalid description. Max length is 500 characters.');

const websiteUrlValidation = body('websiteUrl')
  .exists()
  .withMessage('Invalid websiteUrl. Max length is 100 characters.')
  .isString()
  .withMessage('Invalid websiteUrl. Max length is 100 characters.')
  .notEmpty()
  .withMessage('Invalid websiteUrl. Max length is 100 characters.')
  .isLength({ max: 100 })
  .withMessage('Invalid websiteUrl. Max length is 100 characters.')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage('Invalid websiteUrl format.');

// Validation chains for different operations
export const createBlogValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];

export const updateBlogValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
