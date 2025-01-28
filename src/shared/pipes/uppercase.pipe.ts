import { Injectable, PipeTransform } from '@nestjs/common';

// Transform the input string to uppercase.
@Injectable()
export class UppercasePipe implements PipeTransform<string> {
  transform(value: string): string {
    return value.toUpperCase();
  }
}
