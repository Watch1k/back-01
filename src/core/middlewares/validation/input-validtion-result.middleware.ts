import {
  validationResult,
  ValidationError,
  FieldValidationError,
} from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../types/http-statuses';

const formatErrors = (error: ValidationError) => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length) {
    res.status(HttpStatus.BadRequest).json({ errorsMessages: errors });
    return;
  }

  next();
};
