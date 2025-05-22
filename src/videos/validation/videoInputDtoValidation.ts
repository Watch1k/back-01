import { ValidationError } from '../types/validationError';
import { VideoResolution } from '../types/video';

export const videoInputDtoValidation = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate title
  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim().length > 40
  ) {
    errors.push({
      field: 'title',
      message: 'Invalid title. Max length is 40 characters.',
    });
  }

  // Validate author
  if (
    !data.author ||
    typeof data.author !== 'string' ||
    data.author.trim().length > 20
  ) {
    errors.push({
      field: 'author',
      message: 'Invalid author. Max length is 20 characters.',
    });
  }

  // Validate availableResolutions
  if (
    !data.availableResolutions ||
    !Array.isArray(data.availableResolutions) ||
    data.availableResolutions.length === 0
  ) {
    errors.push({
      field: 'availableResolutions',
      message: 'At least one resolution should be added',
    });
  } else {
    const validResolutions = Object.values(VideoResolution);
    const invalidResolutions = data.availableResolutions.filter(
      (resolution: VideoResolution) => !validResolutions.includes(resolution),
    );
    if (invalidResolutions.length > 0) {
      errors.push({
        field: 'availableResolutions',
        message: `Invalid resolutions: ${invalidResolutions.join(', ')}`,
      });
    }
  }

  // Validate additional fields for update
  if ('canBeDownloaded' in data && typeof data.canBeDownloaded !== 'boolean') {
    errors.push({
      field: 'canBeDownloaded',
      message: 'canBeDownloaded must be a boolean',
    });
  }

  if (
    'minAgeRestriction' in data &&
    data.minAgeRestriction !== null &&
    (typeof data.minAgeRestriction !== 'number' ||
      data.minAgeRestriction < 1 ||
      data.minAgeRestriction > 18)
  ) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'minAgeRestriction must be null or a number between 1 and 18',
    });
  }

  if (
    'publicationDate' in data &&
    data.publicationDate !== null &&
    (typeof data.publicationDate !== 'string' ||
      isNaN(Date.parse(data.publicationDate)))
  ) {
    errors.push({
      field: 'publicationDate',
      message: 'publicationDate must be a valid date string',
    });
  }

  return errors;
};
