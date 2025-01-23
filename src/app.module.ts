import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { JsonwebtokenModule } from './common/jsonwebtoken/jsonwebtoken.module';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [AuthModule, PrismaModule, ProfileModule, JsonwebtokenModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
