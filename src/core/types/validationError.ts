import { HttpStatus } from './http-statuses';

export type ValidationErrorType = {
  status: HttpStatus;
  detail: string;
  source?: string;
  code?: string;
};

// Test-facing validation error shape
export type ValidationError = {
  message: string;
  field: string;
};
