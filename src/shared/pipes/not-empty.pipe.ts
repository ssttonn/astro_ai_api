import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

export class NotEmptyPipe<T> implements PipeTransform {
  transform(value: T, _: ArgumentMetadata) {
    if (!value || Object.keys(value).length === 0) {
      throw new BadRequestException('Request body cannot be empty');
    }
    return value;
  }
}
