import { ValidationError } from '../types/validationError';
import { ValidationErrorDto } from '../types/validationError.dto';

export const createErrorMessages = (
  errors: ValidationError[],
): ValidationErrorDto => {
  return { errorsMessages: errors };
};
