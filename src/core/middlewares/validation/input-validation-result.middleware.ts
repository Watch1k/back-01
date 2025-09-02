import {
  validationResult,
  ValidationError,
  FieldValidationError,
} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-statuses';
import { ValidationError as OutputValidationError } from '../../types/validationError';

export const createErrorMessages = (
  errors: OutputValidationError[],
): { errorsMessages: OutputValidationError[] } => {
  return {
    errorsMessages: errors,
  };
};

const formatValidationError = (
  error: ValidationError,
): OutputValidationError => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatValidationError)
    .array({ onlyFirstError: true });

  if (errors.length) {
    res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    return;
  }

  next();
};
