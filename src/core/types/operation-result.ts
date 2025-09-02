export type OperationResult<T = void> = {
  success: boolean;
  message: string;
  data?: T;
};
