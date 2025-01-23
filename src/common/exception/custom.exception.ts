import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from '../response/custom.response';

export class AppException<T> extends HttpException {
  constructor(
    error: T,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    message: string = 'An error occurred',
  ) {
    super(Response.error(error, message, status), status);
  }
}
