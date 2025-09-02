import {
  validationResult,
  ValidationError,
  FieldValidationError,
} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-statuses';
import { ValidationErrorType } from '../../types/validationError';
import { ValidationErrorListOutput } from '../../types/validationError.dto';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorListOutput => {
  return {
    errors: errors.map((error) => ({
      status: error.status,
      detail: error.detail, //error message
      source: { pointer: error.source ?? '' }, //error field
      code: error.code ?? null, //domain error code
    })),
  };
};

const formatValidationError = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    status: HttpStatus.BadRequest,
    source: expressError.path,
    detail: expressError.msg,
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
