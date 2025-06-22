import { body } from 'express-validator';

const nameValidation = body('name')
  .exists()
  .isString()
  .isLength({ max: 15 })
  .trim()
  .notEmpty()
  .withMessage('Invalid name. Max length is 15 characters.');

const descriptionValidation = body('description')
  .exists()
  .isString()
  .isLength({ max: 500 })
  .trim()
  .notEmpty()
  .withMessage('Invalid description. Max length is 500 characters.');

const websiteUrlValidation = body('websiteUrl')
  .exists()
  .isString()
  .isLength({ max: 100 })
  .trim()
  .notEmpty()
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
