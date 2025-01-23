import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { AppException } from './common/exception/custom.exception';
import { ValidationError } from 'class-validator';
import { AllExceptionFilter } from './common/filters/exception.filter';

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
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
