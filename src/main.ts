import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppException } from './common/exception/custom.exception';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new AppException(
          validationErrors.map((error) => ({
            field: error.property,
            error:
              error.constraints && typeof error.constraints === 'object'
                ? Object.values(error.constraints).join(', ')
                : 'Unknown error',
          })),
          HttpStatus.BAD_REQUEST,
        );
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
