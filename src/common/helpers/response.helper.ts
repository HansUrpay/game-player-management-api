import { ApiResponse } from '../interfaces/response.interface';

export function createResponse<T>(
  data: T,
  message: string,
  statusCode: number,
): ApiResponse<T> {
  return {
    statusCode,
    message,
    success: statusCode < 400,
    error: statusCode >= 400 ? message : undefined,
    data,
  };
}
