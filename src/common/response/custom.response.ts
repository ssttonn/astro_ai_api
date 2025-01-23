import { HttpStatus } from '@nestjs/common';

export class Response {
  static success<T>(
    data: T,
    status: HttpStatus = HttpStatus.OK,
    message: string = 'Succeed!',
  ) {
    return {
      status,
      data,
      message,
    };
  }

  static error<T>(
    error: T,
    message: string = 'Failed!',
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    return {
      status,
      message,
      error,
    };
  }
}
