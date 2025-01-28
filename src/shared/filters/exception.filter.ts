import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AppException } from 'src/common/exception/custom.exception';

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
      if (exception instanceof AppException) {
        super.catch(exception, host);
      } else {
        super.catch(
          new AppException(undefined, exception.getStatus(), exception.message),
          host,
        );
      }
    }
  }
}
