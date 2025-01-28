import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { AppException } from './common/exception/custom.exception';

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

  // const httpAdapterHost = app.get(HttpAdapterHost);
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
