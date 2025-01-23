import { HttpStatus } from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from '../types/custom.type';

export class ResponseHandler {
  static success<T>(
    data: T,
    status: HttpStatus = HttpStatus.OK,
    message: string = 'Succeed!',
  ): SuccessResponse<T> {
    return {
      status,
      success: true,
      data,
      message,
    };
  }

  static error<T>(
    error: T,
    message: string = 'Failed!',
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ): ErrorResponse<T> {
    return {
      status,
      success: false,
      message,
      error,
    };
  }
}
