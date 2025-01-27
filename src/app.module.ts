import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllExceptionFilter } from './common/filters/exception.filter';
import { AuthGuard } from './common/guards/auth.guard';
import {
  HigherVersionGuard,
  LowerVersionGuard,
  SpecificVersionGuard,
} from './common/guards/version.guard';
import { JsonwebtokenModule } from './common/jsonwebtoken/jsonwebtoken.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { UserQuery } from './shared/queries/user.query';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProfileModule,
    JsonwebtokenModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: HigherVersionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: LowerVersionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SpecificVersionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
