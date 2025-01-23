import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { ResponseHandler } from '../response/custom.response';
import { AppException } from '../exception/custom.exception';

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (!(exception instanceof HttpException)) {
      const exceptionString: unknown = JSON.parse(
        JSON.stringify(exception, Object.getOwnPropertyNames(exception)),
      );

      super.catch(
        new AppException(
          exceptionString,
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal server error',
        ),
        host,
      );
    } else {
      super.catch(exception, host);
    }
  }
}
