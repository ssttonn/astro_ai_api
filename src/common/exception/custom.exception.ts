import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseHandler } from '../response/custom.response';

export class AppException<T> extends HttpException {
  constructor(
    error: T,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    message: string = 'An error occurred',
  ) {
    super(ResponseHandler.error(error, message, status), status);
  }
}
