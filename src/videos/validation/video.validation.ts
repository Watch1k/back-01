import { body } from 'express-validator';
import { VideoResolution } from '../types/video';

const titleValidation = body('title')
  .exists()
  .withMessage('Invalid title. Max length is 40 characters.')
  .isString()
  .withMessage('Invalid title. Max length is 40 characters.')
  .notEmpty()
  .withMessage('Invalid title. Max length is 40 characters.')
  .isLength({ max: 40 })
  .withMessage('Invalid title. Max length is 40 characters.');

const authorValidation = body('author')
  .exists()
  .withMessage('Invalid author. Max length is 20 characters.')
  .isString()
  .withMessage('Invalid author. Max length is 20 characters.')
  .notEmpty()
  .withMessage('Invalid author. Max length is 20 characters.')
  .isLength({ max: 20 })
  .withMessage('Invalid author. Max length is 20 characters.');

const availableResolutionsValidation = body('availableResolutions')
  .exists()
  .withMessage('should exist')
  .isArray()
  .withMessage('should be an array')
  .isArray({ min: 1 })
  .withMessage('At least one resolution should be added')
  .custom((value: VideoResolution[]) => {
    const validResolutions = Object.values(VideoResolution);
    const invalidResolutions = value.filter(
      (resolution) => !validResolutions.includes(resolution),
    );

    if (invalidResolutions.length > 0) {
      throw new Error(`Invalid resolutions: ${invalidResolutions.join(', ')}`);
    }

    return true;
  })
  .withMessage('At least one resolution should be added');

const canBeDownloadedValidation = body('canBeDownloaded')
  .isBoolean()
  .withMessage('canBeDownloaded must be a boolean');

const minAgeRestrictionValidation = body('minAgeRestriction')
  .optional({ nullable: true })
  .custom((value) => {
    if (value === null) return true;
    if (typeof value !== 'number') return false;
    return value >= 1 && value <= 18;
  })
  .withMessage('minAgeRestriction must be null or a number between 1 and 18');

const publicationDateValidation = body('publicationDate')
  .optional({ nullable: true })
  .custom((value) => {
    if (value === null) return true;
    if (typeof value !== 'string') return false;
    return !isNaN(Date.parse(value));
  })
  .withMessage('publicationDate must be a valid date string');

// Validation chains for different operations
export const createVideoValidation = [
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
];

export const updateVideoValidation = [
  titleValidation,
  authorValidation,
  availableResolutionsValidation,
  canBeDownloadedValidation,
  minAgeRestrictionValidation,
  publicationDateValidation,
];
